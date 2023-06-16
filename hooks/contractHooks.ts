"use client";
import { contractsApi } from "@/utils/spacetraders-apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useContracts = () => {
  return useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const { data } = await contractsApi.getContracts()
      return data.data;
    },
  })
}

export const useAcceptContract = (contractId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await contractsApi.acceptContract(contractId)
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['contracts', 'agent']})
    }
  })
}