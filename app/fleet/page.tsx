"use client";

import ShipCard from "@/components/ShipCard/ShipCard";
import { useShips } from "@/hooks/fleetHooks";

export default function FleetInfo() {
  const { data: ships, isLoading } = useShips();

  if (isLoading) {
    return null;
  }

  return (
    <>
      {ships?.map((ship) => (
        <ShipCard key={ship.symbol} ship={ship} />
      ))}
    </>
  );
}
