//
//
import createClient from "openapi-fetch";
import type { paths } from "../openApi";

const { GET } = createClient<paths>({
  baseUrl: "https://api.example.com/v1/",
});

export async function getExchangeRate() {
  const { data, error } = await GET("/currency/exchangerate", {
    params: {
      query: {
        base: "EUR",
      },
    },
  });
}
