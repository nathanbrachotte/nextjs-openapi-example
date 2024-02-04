import { apiCall } from "@/apiCall";

export default async function Home() {
  const exchangeRate = await apiCall(
    () => {
      return "myLocalJWT";
    },
    "/currency/exchangerate",
    "get",
    {
      query: {
        base: "EUR",
      },
    }
  );

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
