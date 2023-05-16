'use client'
import { useShip } from "@/hooks/fleetHooks";
import Link from "next/link";

export default function ShipInfo({
  params,
}: {
  params: { ship: string };
}) {
  const { data: shipData } = useShip(params.ship) 
  return (
    <>
      <Link href={`/fleet/${shipData?.symbol}`}>
        {shipData?.symbol}: {shipData?.registration.role}
      </Link>
      <ul>
        <li>
          <b>status:</b>
          {shipData?.nav.status}
        </li>
        <li>
          <b>location:</b>
          {shipData?.nav.waypointSymbol} ({shipData?.nav.route.destination.type})
        </li>
        <li>
          <b>fuel:</b>
          {`${shipData?.fuel.current}/${shipData?.fuel.capacity}`}
        </li>
        <li>
          <b>cargo:</b>
          {`${shipData?.cargo.units}/${shipData?.cargo.capacity}`}
          <ul>
            {shipData?.cargo.inventory.map(cargoItem => (
              <li key={cargoItem.symbol}>{`${cargoItem.symbol}: ${cargoItem.units}`}</li>
            ))}
          </ul>
        </li>
        {/* <ActionList ship={shipData} /> */}
      </ul>
    </>
  );
}

export const revalidate = 5;