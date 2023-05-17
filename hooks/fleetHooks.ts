"use client";
import { ShipType } from "@/spacetraders-sdk/src";
import { fleetApi } from "@/utils/spacetraders-apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useShips = () => {
  return useQuery({
    queryKey: ["ships"],
    queryFn: async () => {
      const { data } = await fleetApi.getMyShips();
      return data;
    },
  });
};

export const useShip = (symbol: string) => {
  // const fleet = new FleetApi(configuration)
  return useQuery({
    queryKey: ["ships"],
    queryFn: async () => {
      const { data } = await fleetApi.getMyShip({ shipSymbol: symbol });
      return data;
    },
  });
};

export const usePurchaseShip = (shipType: ShipType, waypointSymbol: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await fleetApi.purchaseShip({
        purchaseShipRequest: { shipType, waypointSymbol },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ships", "agent"] });
    },
  });
};

export const useMine = (shipSymbol: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await fleetApi.extractResources({
        shipSymbol,
        extractResourcesRequest: {
          /* Add survey data here */
        },
      });
      return data;
    },
    // we probably shouldn't invalidate ships here, since the response from this endpoint actually returns
    // everything we need (what minerals were added to the ship and how long the cooldown is)
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ships"] });
    },
  });
};

export const useNavigateShip = (shipSymbol: string, waypointSymbol: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await fleetApi.navigateShip({
        shipSymbol,
        navigateShipRequest: { waypointSymbol },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ships"] });
    },
  });
};
