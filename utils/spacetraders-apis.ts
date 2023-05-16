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
  accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiTEVHQVBVUjkiLCJpYXQiOjE2ODQwMTAwMzUsInN1YiI6ImFnZW50LXRva2VuIn0.jnJCwE4Cj_OXK89Om6vY0Sd1gq_7uZWezRKUDGOFKYQYqt5U2YMeUUn2nTVNeZYKk8xHUXfWKA3xNwTE3Gyt80_f2wUrg6gthitOzn6SLZFKf6oVJcJ2HzfMZ-sw1m-lYIuiu84d1wC845hX-X_hf8RyBQl5GMzdhm4zit7HNhju_Vff-6hGiUn6D3C6wrHQaEqNYnQ_qwX77Tat4BK4D15dXAWb7RoWfuzKDAEXNg7_yNxty60Dzt19CDR1fr09EiVPnwZaaHdWVEH0I5R1Wtq73aVf6cgW1Sj89mFNeM5-zIFjD0DVee_gXZXqnNw0IPD03hnI20MROZ0F-E4Vhw",
});

export const agentsApi = new AgentsApi(configuration);
export const contractsApi = new ContractsApi(configuration);
export const defaultApi = new DefaultApi(configuration);
export const factionsApi = new FactionsApi(configuration);
export const fleetApi = new FleetApi(configuration);
export const systemsApi = new SystemsApi(configuration)
