"use client";

import ShipCard from "@/components/ShipCard/ShipCard";
import { useShips } from "@/hooks/fleetHooks";

export default function FleetInfo() {
  const { data: ships, isLoading } = useShips();

  if (isLoading) {
    return null;
  }

  return (
    // <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-16">
    <div className="flex flex-wrap justify-center gap-16">
      {ships?.map((ship) => (
        <ShipCard key={ship.symbol} ship={ship} />
      ))}
    </div>
  );
}
