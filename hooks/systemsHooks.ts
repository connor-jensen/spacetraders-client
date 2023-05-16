"use client";
import { systemsApi } from "@/utils/spacetraders-apis";
import { useQuery } from "@tanstack/react-query";

export const useWaypoints = (systemSymbol: string) => {
  return useQuery({
    queryKey: ['waypoints'],
    queryFn: async () => {
      const { data } = await systemsApi.getSystemWaypoints({systemSymbol: systemSymbol})
      return data;
    },
  });
}

export const useShipyard = (waypointSymbol: string) => {
  const systemSymbol = waypointSymbol.slice(0, 7)
  return useQuery({
    queryKey: ['shipyard'],
    queryFn: async () => {
      const { data } = await systemsApi.getShipyard({systemSymbol: systemSymbol, waypointSymbol: waypointSymbol})
      return data;
    },
  });
}