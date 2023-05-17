"use client";

import { useShip } from "@/hooks/fleetHooks";
import Card from "../Generic/Card";
import { Ship } from "@/spacetraders-sdk/src";
import Link from "next/link";

export default function ShipCard({ ship }: { ship: Ship }) {
  if (!ship) return <div>Error: No ship data</div>;
  return (
    <Card>
      <h2>
        {ship.symbol} ({ship.registration.role})
      </h2>
      <h3>{`Cargo: ${ship?.cargo.units} / ${ship.cargo.capacity}`}</h3>
      {ship.cargo.units > 0 && (
        <ul className="cardsubsection">
          {ship.cargo.inventory.map((item) => (
            <li key={item.name}>{`${item.name}: ${item.units}`}</li>
          ))}
        </ul>
      )}

      <div>
        Location:{" "}
        <Link
          className="underline underline-offset-4"
          href={`/systems/${ship.nav.systemSymbol}`}
        >
          {ship.nav.waypointSymbol}
        </Link>
      </div>
    </Card>
  );
}
