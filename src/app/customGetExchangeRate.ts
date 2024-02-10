import { apiCall } from "@/customApiCall";
import { RequestParams } from "@/openApiTypes";

const path = "/currency/exchangerate";

type ExchangeRateQuery = RequestParams<typeof path, "get">["query"]["base"];

// Usage
const { data: exchangeRate } = useGetExchangeRate("EUR");

// Client side
export const useGetExchangeRate = (baseCurrency: ExchangeRateQuery) => {
  // Or whichever function that returns a token from the client
  const { getToken } = useAuth();

  // Example with react-query
  return useQuery({
    queryKey: [path],
    queryFn: async () =>
      apiCall(getToken, path, "get", {
        query: {
          base: baseCurrency,
        },
      }),
  });
};

// Server side
export async function getExchangeRate(baseCurrency: ExchangeRateQuery) {
  const { getToken } = auth();

  return await apiCall(getToken, path, "get", {
    query: {
      base: baseCurrency,
    },
  });
}
