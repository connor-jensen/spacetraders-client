"use client";
import { agentsApi } from "@/utils/spacetraders-apis";
import { useQuery } from "@tanstack/react-query";

export const useAgent = () => {
  return useQuery({
    queryKey: ['agent'],
    queryFn: async () => {
      const { data } = await agentsApi.getMyAgent()
      return data;
    },
  })
}