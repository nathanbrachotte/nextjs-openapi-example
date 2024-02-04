import type { components as OpenApiComponents, paths } from "./openApi";

// General type helpers
export type AllPaths = keyof paths;
export type PathMethods<T extends AllPaths> = keyof paths[T];

export type RequestParams<
  P extends AllPaths,
  M extends PathMethods<P>
> = paths[P][M] extends {
  parameters: Record<any, any>;
}
  ? paths[P][M]["parameters"]
  : undefined;

export type PathParams<
  P extends AllPaths,
  M extends PathMethods<P>
> = RequestParams<P, M> extends { path: Record<any, any> }
  ? RequestParams<P, M>["path"]
  : undefined;

export type RequestBody<
  P extends AllPaths,
  M extends PathMethods<P>
> = paths[P][M] extends {
  requestBody: { content: { "application/json": Record<any, any> } };
}
  ? paths[P][M]["requestBody"]["content"]["application/json"]
  : undefined;

export type ResponseType<
  P extends AllPaths,
  M extends PathMethods<P>
> = paths[P][M] extends {
  responses: { 200: { content: any } };
}
  ? paths[P][M]["responses"][200]["content"]["application/json"]
  : undefined;
