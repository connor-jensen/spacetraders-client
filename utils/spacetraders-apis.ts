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
  accessToken: process.env.ACCESS_TOKEN,
});

export const agentsApi = new AgentsApi(configuration);
export const contractsApi = new ContractsApi(configuration);
export const defaultApi = new DefaultApi(configuration);
export const factionsApi = new FactionsApi(configuration);
export const fleetApi = new FleetApi(configuration);
export const systemsApi = new SystemsApi(configuration)
