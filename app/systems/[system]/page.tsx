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
import {
  useMine,
  useNavigateShip,
  usePurchaseShip,
  useShips,
} from "@/hooks/fleetHooks";
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
import {
  ReactComponentElement,
  ReactElement,
  useEffect,
  useState,
} from "react";
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
            <LocalShipActions
              key={ship.symbol}
              ship={ship}
              waypoint={waypoint}
            />
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

function LocalShipActions({
  ship,
  waypoint,
}: {
  ship: Ship;
  waypoint: Waypoint;
}) {
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
          {waypoint.type === "ASTEROID_FIELD" && <MineAction ship={ship} />}
          <RefuelAction ship={ship} />
          <FlightMode ship={ship} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FlightMode({ ship }: { ship: Ship }) {
  // TODO: use orbit endpoint
  // TODO: use dock endpoint
  // TODO: don't display this option if the ship can't do either (ex: in transit), or
  // show that the ship WILL be in orbit upon arrival, but disable the dock option,
  // and move the timer to be on the button

  // const { mutate: orbit } = useOrbit(ship.symbol);
  const title = "Flight Mode";
  const description = "Toggle Orbiting or Docking";
  const FlightModeDetails = () => (
    <h3>The ship is currently {ship.nav.flightMode}</h3>
  );
  return (
    <ShipAction
      title={title}
      description={description}
      content={<FlightModeDetails />}
      clickHandler={() => {}}
    />
  );
}

function RefuelAction({ ship }: { ship: Ship }) {
  // TODO: use refuel endpoint
  // TODO: use market endpoint to check both the export price (if any) and the exchange price (if any)
  // TODO: don't display this option if there is no fuel for sale

  // const { mutate: refuel } = useRefuel(ship.symbol);
  const title = "Refuel";
  const description = "Refuel for future travel";
  const FuelDetails = () => (
    <>
      <h3>
        Current fuel: {ship.fuel.current} / {ship.fuel.capacity}
      </h3>
      <div>The price of fuel here is: ##</div>
    </>
  );
  return (
    <ShipAction
      title={title}
      description={description}
      content={<FuelDetails />}
      clickHandler={() => {}}
    />
  );
}

function MineAction({ ship }: { ship: Ship }) {
  // TODO: add a scan secondary button (if the ship has the module)
  const { mutate: mineResource } = useMine(ship.symbol);
  const title = "Mine";
  const description = "Mine resources from an Astroid Field";
  const CargoDetails = () => (
    <>
      <h3>{`Cargo: ${ship?.cargo.units} / ${ship.cargo.capacity}`}</h3>
      {ship.cargo.units > 0 && (
        <ul className="cardsubsection">
          {ship.cargo.inventory.map((item) => (
            <li key={item.name}>{`${item.name}: ${item.units}`}</li>
          ))}
        </ul>
      )}
    </>
  );
  return (
    <ShipAction
      title={title}
      description={description}
      content={<CargoDetails />}
      clickHandler={mineResource}
    />
  );
}

function ShipAction({
  title,
  description,
  content,
  clickHandler,
}: {
  title: string;
  description: string;
  content: React.ReactNode;
  clickHandler: Function;
}) {
  return (
    <NewCard className="rounded-xl bg-spacegray">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={"secondary"}
          onClick={() => clickHandler()}
        >
          {title.toUpperCase()}
        </Button>
      </CardFooter>
    </NewCard>
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
