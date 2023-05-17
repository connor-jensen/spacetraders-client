"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, createContext, useContext } from "react";

const queryClient = new QueryClient();

type TimersContextType = {
  times: number[] | null,
  changeTimes: (arg: number[]) => void
}
const TimersContext = createContext<TimersContextType | undefined>(undefined)
export const useRadialTimersContext = () => useContext(TimersContext) as TimersContextType



export function Providers({ children }: { children: React.ReactNode }) {
  const [times, setTimes] = useState<TimersContextType['times']>(null);
  const changeTimes: TimersContextType['changeTimes'] = (newTimes) => {
    setTimes(newTimes);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TimersContext.Provider value={{times, changeTimes}}>
        {children}
      </TimersContext.Provider>
    </QueryClientProvider>
  );
}
