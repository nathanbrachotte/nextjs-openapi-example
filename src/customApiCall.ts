import {
  AllPaths,
  PathMethods,
  RequestBody,
  RequestParams,
  ResponseType,
} from "./openApiTypes";
import queryString from "query-string";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://api.example.com/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function apiCall<
  P extends AllPaths,
  M extends PathMethods<P>,
  R extends RequestParams<P, M> extends undefined
    ? undefined
    : RequestParams<P, M>,
  //* We need to type "post" method differently because it requires an extra request body
  B extends M extends "post" ? RequestBody<P, M> : never
>(
  getToken: () => Promise<string | null>,
  url: P,
  method: M,
  params: R,
  ...rest: M extends "post" ? [B] : []
): Promise<ResponseType<P, M>> {
  let finalUrl: string = url;
  const authToken = await getToken();

  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  // Add the path parameters to the url, if any
  if (params?.path) {
    for (const [key, value] of Object.entries(params.path)) {
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        finalUrl = finalUrl.replace(`{${key}}`, value.toString());
      } else {
        throw new Error(`Invalid type for path parameter ${key}`);
      }
    }
  }

  switch (method) {
    case "get":
      const response = await axiosInstance.get(finalUrl, {
        ...config,
        params: {
          ...params?.query,
        },
        paramsSerializer: (params) => {
          return queryString.stringify(params, {
            arrayFormat: "comma",
          });
        },
      });

      return response.data;

    case "post":
      //! FIXME: Can't access rest[0] because from a type POV it might not exist
      if (rest.length === 0) {
        throw new Error("Missing request body for post method");
      } else {
        // @ts-expect-error TODO: check rest[0] exists
        const requestBody: RequestParams<P, M> = rest[0]; // TypeScript can now infer that rest[0] exists

        return await (
          await axiosInstance.post(
            finalUrl,
            {
              ...requestBody,
            },
            config
          )
        ).data;
      }
    case "delete":
      return await axiosInstance.delete(finalUrl, config);

    case "patch":
      return await axiosInstance.patch(
        finalUrl,
        {
          params: {
            ...params,
          },
        },
        config
      );

    default:
      throw new Error("Method not implemented");
  }
}
