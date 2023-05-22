"use client";
import { SellCargo201Response, SellCargo201ResponseData, Ship, ShipCargoItem, ShipType } from "@/spacetraders-sdk/src";
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
      queryClient.invalidateQueries({ queryKey: ["ships"] });
      queryClient.invalidateQueries({ queryKey: ["agent"] });
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

export const useDockShip = (shipSymbol: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await fleetApi.dockShip({
        shipSymbol,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ships"] });
    },
  });
};

export const useOrbitShip = (shipSymbol: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await fleetApi.orbitShip({
        shipSymbol,
      });
      return data;
    },
    // optimistic update
    onMutate: async () => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["ships"]})

      // Snapshot previous value
      const data = queryClient.getQueryData(["ships"]) as Ship[]
      const previousStatus = data.find(ship => ship.symbol === shipSymbol)?.nav.status

      queryClient.setQueryData<Ship[]>(['ships'], (oldShipData) => {
        if (oldShipData) return [...oldShipData]
        else return []
      })

      console.log(previousStatus)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ships"] });
    },
  });
};

export const useRefuelShip = (shipSymbol: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await fleetApi.refuelShip({
        shipSymbol,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ships"] });
      queryClient.invalidateQueries({ queryKey: ["agent"] });

    },
  });
};

export const useSellAllCargo = (
  shipSymbol: string,
  inventory: ShipCargoItem[]
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      let data = [];
      for (const inv of inventory) {
        try {
          const {data: res} = await fleetApi.sellCargo({
            shipSymbol,
            sellCargoRequest: { symbol: inv.symbol, units: inv.units },
          });
          data.push(res);
        } catch (err) {
          data.push(err);
        }
      }
      return data as SellCargo201ResponseData[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ships"] });
      queryClient.invalidateQueries({ queryKey: ["agent"] });
    },
  });
};
