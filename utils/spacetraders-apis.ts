import {
  AgentsApi,
  Configuration,
  ContractsApi,
  DefaultApi,
  FactionsApi,
  FleetApi,
  SystemsApi,
} from "@/spacetraders-sdk/src";

const configuration = new Configuration({
  basePath: "https://api.spacetraders.io/v2",
  // accessToken: process.env.ACCESS_TOKEN,
  accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiTEVHQVBVUjkiLCJ2ZXJzaW9uIjoidjIiLCJyZXNldF9kYXRlIjoiMjAyMy0wNS0yMCIsImlhdCI6MTY4NDc3OTI4NCwic3ViIjoiYWdlbnQtdG9rZW4ifQ.Uz_xvp3MKW42PflK4bHtgi0w6N9SZIDrF_-l6GdrYTQYhxNwBLo473rzUP3wT1vKY6PRDagjMNjlVMMGRJXhRkB6nEDKtQKln7hMnu8pwUUymlP1CY6lrKrY_HKUu2FBx0Vq53h_knYotX8-3fGDWEcNHEvKOPPo1QFpwZmmfmTyw-3ydfgfbrfKFwKfiydPEp2rmADS1ZOP3ZpHv4dWl37amQOZ7mjfEUDUgheegVKQ1pFuSNNs-Qwm_QsZA47GdJMejernGYGXFE9ESsn4mdUy7DDVpOCcXtSOj3h7MGrJJXQlWf8PhZ_lHwaeOUvcMTC1EVx8ybbFwGCD8hGMzQ",
});

export const agentsApi = new AgentsApi(configuration);
export const contractsApi = new ContractsApi(configuration);
export const defaultApi = new DefaultApi(configuration);
export const factionsApi = new FactionsApi(configuration);
export const fleetApi = new FleetApi(configuration);
export const systemsApi = new SystemsApi(configuration)
