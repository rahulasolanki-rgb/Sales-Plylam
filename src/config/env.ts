export const env = {
  API_BASE_URL: process.env.API_BASE_URL ?? "",
  USE_MOCK_API: (process.env.USE_MOCK_API ?? "true").toLowerCase() === "true",
  AUTH_TOKEN_KEY: "sales_portal_token",
};
