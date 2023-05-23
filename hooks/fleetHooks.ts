"use client";
import { SellCargo201Response, SellCargo201ResponseData, Ship, ShipCargoItem, ShipType } from "@/spacetraders-sdk/src";
import { fleetApi } from "@/utils/spacetraders-apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { produce } from 'immer'

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
      const previousState = queryClient.getQueryData(["ships"]) as Ship[]
      const previousStatus = previousState.find(ship => ship.symbol === shipSymbol)?.nav.status

      const nextState = produce(previousState, (draftState) => {
        const targetShip = previousState.find(ship => ship.symbol === shipSymbol)

        if (targetShip === undefined) return

        if (targetShip.nav.status === "DOCKED") {
          targetShip.nav.status = "IN_ORBIT"
        }

        else if (targetShip.nav.status === "IN_ORBIT") {
          targetShip.nav.status = "DOCKED"
        }
      })

      queryClient.setQueryData<Ship[]>(['ships'], (oldShipData) => nextState)

      return { previousState };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['ships'], context?.previousState)
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['ships']})
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["ships"] });
    // },
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
