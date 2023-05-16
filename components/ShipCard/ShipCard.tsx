'use client'

import { useShip } from "@/hooks/fleetHooks";
import Card from "../Generic/Card";
import { Ship } from "@/spacetraders-sdk/src";
import Link from "next/link";

export default function ShipCard({ship} : {ship: Ship}) {

  return (
    <Card>
      <div>{ship?.symbol}</div>
      <div>{`Cargo: ${ship?.cargo.units} / ${ship?.cargo.capacity}`}</div>
      <div>Location: <Link className="underline underline-offset-4" href={`/systems/${ship.nav.systemSymbol}`}>{ship.nav.waypointSymbol}</Link></div>
    </Card>
  )
}