"use client";

import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
  Card as NewCard,
} from "@/components/ui/card";
import Card from "@/components/Generic/Card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useShipyard, useWaypoints } from "@/hooks/systemsHooks";
import { Ship, ShipRole, ShipType, Waypoint } from "@/spacetraders-sdk/src";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useNavigateShip, usePurchaseShip, useShips } from "@/hooks/fleetHooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ShipCard from "@/components/ShipCard/ShipCard";
import { useEffect, useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";

export default function SystemPage({ params }: { params: { system: string } }) {
  const { data: waypoints, isLoading } = useWaypoints(params.system);
  const { data: ships, isLoading: shipsIsLoading } = useShips();

  if (!waypoints || isLoading || shipsIsLoading) {
    return null;
  }

  return (
    <>
      <h1 className="flex justify-center">System: {params.system}</h1>
      <div className="flex justify-center">
        <div className="grid gap-4 lg:grid-cols-4 lg:max-w-7xl md:grid-cols-2 sm:grid-cols-1">
          {waypoints.map((waypoint) => {
            return (
              <WaypointCard
                key={waypoint.symbol}
                waypoint={waypoint}
                ships={ships}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

function WaypointCard({
  waypoint,
  ships,
}: {
  waypoint: Waypoint;
  ships: Ship[] | undefined;
}) {
  const waypointName = waypoint.symbol.split("-")[2] || "Unknown Waypoint";
  // see if any of the player's ships are at this waypoint
  const localShips = ships?.filter(
    (ship) => ship.nav.waypointSymbol === waypoint.symbol
  );
  return (
    <Card>
      <h2>
        {waypointName} ({waypoint.type})
      </h2>
      <ul>
        {waypoint.traits.map((trait) => {
          if (trait.symbol === "SHIPYARD") {
            return (
              <ShipYardButton
                key={waypoint.symbol}
                waypointSymbol={waypoint.symbol}
              />
            );
          }
          return <li key={trait.symbol}>{trait.name}</li>;
        })}
      </ul>
      {localShips && localShips.length > 0 && (
        <ul>
          {localShips?.map((ship) => (
            <ShipButton key={ship.symbol} ship={ship} waypoint={waypoint} />
          ))}
        </ul>
      )}
      <SendShipMenu waypoint={waypoint.symbol} />
    </Card>
  );
}

function CountdownTimer({ arrivalTime }: { arrivalTime: Date }) {
  const timeLeft = useCountdown(arrivalTime);
  return <div>Ship arrives in: {timeLeft}</div>;
}

function ShipButton({ ship, waypoint }: { ship: Ship; waypoint: Waypoint }) {
  console.log(ship);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="bg-goldstar font-bold w-full">
          {ship.symbol}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] rounded-2xl p-8 sm:rounded-2xl bg-transparent border-none">
        <DialogHeader>
          <DialogTitle>
            <h2 className="text-lg font-semibold tracking-tight">
              {ship.symbol} ({ship.registration.role})
            </h2>
          </DialogTitle>
          <DialogDescription>
            <p className="text-sm text-gray-100">Assign the ship a task</p>
            {ship.nav.status === "IN_TRANSIT" && (
              <CountdownTimer arrivalTime={ship.nav.route.arrival} />
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 flex-col">
          {waypoint.type === "ASTEROID_FIELD" && (
            <NewCard key={ship.symbol} className="rounded-xl bg-spacegray">
              <CardHeader>
                <CardTitle>Mine</CardTitle>
                <CardDescription>{`Cargo: ${ship?.cargo.units} / ${ship.cargo.capacity}`}</CardDescription>
              </CardHeader>
              <CardContent>
                <div>List the kind of minerals available at this location</div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={"secondary"}
                  onClick={() => {
                    console.log("Ship action clicked");
                  }}
                >
                  Mine
                </Button>
              </CardFooter>
            </NewCard>
          )}
          <NewCard key={ship.symbol} className="rounded-xl bg-spacegray">
            <CardHeader>
              <CardTitle>Dock/Orbit</CardTitle>
              <CardDescription>
                Switch between docking and orbiting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>Currently docked/orbiting</div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={"secondary"}
                onClick={() => {
                  console.log("Ship action clicked");
                }}
              >
                Dock/Orbit
              </Button>
            </CardFooter>
          </NewCard>
          <NewCard key={ship.symbol} className="rounded-xl bg-spacegray">
            <CardHeader>
              <CardTitle>Refuel</CardTitle>
              <CardDescription>Refuel the ship</CardDescription>
            </CardHeader>
            <CardContent>
              <div>Current fuel: ##/## -- do not show this unless docked</div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={"secondary"}
                onClick={() => {
                  console.log("Ship action clicked");
                }}
              >
                Refuel
              </Button>
            </CardFooter>
          </NewCard>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShipYardButton({ waypointSymbol }: { waypointSymbol: string }) {
  const { data: shipyardData } = useShipyard(waypointSymbol);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="bg-goldstar font-bold w-full">
          SHIPYARD
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] rounded-2xl p-8 sm:rounded-2xl bg-transparent border-none">
        <DialogHeader>
          <DialogTitle>
            <h2 className="text-lg font-semibold tracking-tight">Shipyard</h2>
          </DialogTitle>
          <DialogDescription>
            <p className="text-sm text-gray-100">
              See what ships are available to purchase
            </p>
          </DialogDescription>
        </DialogHeader>
        {shipyardData?.ships && (
          <div className="flex gap-4 flex-col">
            {shipyardData.ships.map((ship) => (
              <NewCard key={ship.type} className="rounded-xl bg-spacegray">
                <CardHeader>
                  <CardTitle>{ship.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-evenly">
                    <div>
                      <div className="font-medium -ml-2 text-white">
                        Mounts:
                      </div>
                      {ship.mounts.map((mount) => (
                        <div
                          key={mount.symbol}
                          className="text-sm text-gray-100"
                        >
                          {mount.name}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="font-medium -ml-2 text-white ">
                        Engine:
                      </div>
                      <div className="text-gray-100">{ship.engine.name}</div>
                    </div>
                    <div>
                      <div className="font-medium -ml-2 text-white ">
                        Price:
                      </div>
                      <div className="text-gray-100">{ship.purchasePrice}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <PurchaseShipButton
                    shipType={ship.type!}
                    waypoint={shipyardData.symbol}
                  />
                </CardFooter>
              </NewCard>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PurchaseShipButton({
  shipType,
  waypoint,
}: {
  shipType: ShipType;
  waypoint: string;
}) {
  const { mutate: purchaseShip } = usePurchaseShip(shipType, waypoint);

  return (
    <Button
      className="w-full"
      variant={"secondary"}
      onClick={() => purchaseShip()}
    >
      Purchase
    </Button>
  );
}

function SendShipMenu({ waypoint }: { waypoint: string }) {
  const { data: ships } = useShips();

  if (!ships) {
    return <div>loading ships...</div>;
  }

  const surveyors = ships.filter(
    (ship) => ship.registration.role === "SURVEYOR"
  );
  const excavators = ships.filter(
    (ship) => ship.registration.role === "EXCAVATOR"
  );
  const command = ships.filter((ship) => ship.registration.role === "COMMAND");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Send Ship</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {command.length > 0 && (
          <SendShipGroup
            shipGroup={command}
            groupName="COMMAND"
            destinationWaypoint={waypoint}
          />
        )}
        {surveyors.length > 0 && (
          <SendShipGroup
            shipGroup={surveyors}
            groupName="SURVEYOR"
            destinationWaypoint={waypoint}
          />
        )}
        {excavators.length > 0 && (
          <SendShipGroup
            shipGroup={excavators}
            groupName="EXCAVATOR"
            destinationWaypoint={waypoint}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SendShipGroup({
  shipGroup,
  groupName,
  destinationWaypoint,
}: {
  shipGroup: Ship[];
  groupName: ShipRole;
  destinationWaypoint: string;
}) {
  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <span>Send {groupName}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            {shipGroup.length > 0 &&
              shipGroup.map((ship) => (
                <SendShipItem
                  key={ship.symbol}
                  ship={ship}
                  destinationWaypoint={destinationWaypoint}
                />
              ))}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
}

function SendShipItem({
  ship,
  destinationWaypoint,
}: {
  ship: Ship;
  destinationWaypoint: string;
}) {
  const { mutate: sendShip } = useNavigateShip(
    ship.symbol,
    destinationWaypoint
  );

  return (
    <DropdownMenuItem>
      <span onClick={() => sendShip()}>{ship.symbol}</span>
    </DropdownMenuItem>
  );
}
