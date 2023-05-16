"use client";
import { ShipType } from "@/spacetraders-sdk/src";
import { fleetApi } from "@/utils/spacetraders-apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useShips = () => {
  return useQuery({
    queryKey: ['ships'],
    queryFn: async () => {
      const { data } = await fleetApi.getMyShips()
      return data;
    },
  });
}

export const useShip = (symbol: string) => {
  // const fleet = new FleetApi(configuration)
  return useQuery({
    queryKey: ['ships'],
    queryFn: async () => {
      const { data } = await fleetApi.getMyShip({shipSymbol: symbol})
      return data;
    },
  });
};

export const usePurchaseShip = (shipType: ShipType, waypointSymbol: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await fleetApi.purchaseShip({purchaseShipRequest: {shipType, waypointSymbol}})
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['ships', 'agent']})
    }
  })
}