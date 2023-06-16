"use client";

import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFuelPrice, useShipyard, useWaypoints } from "@/hooks/systemsHooks";
import {
  Ship,
  ShipRole,
  ShipType,
  Waypoint,
  WaypointTrait,
} from "@/spacetraders-sdk-old/src";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import {
  useDockShip,
  useMine,
  useNavigateShip,
  useOrbitShip,
  usePurchaseShip,
  useRefuelShip,
  useSellAllCargo,
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
import { useCountdown } from "@/hooks/useCountdown";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function SystemPage({ params }: { params: { system: string } }) {
  const { data: waypoints, isLoading } = useWaypoints(params.system);
  const { data: ships, isLoading: shipsIsLoading } = useShips();

  if (!waypoints || isLoading || shipsIsLoading) {
    return null;
  }

  const sortedWaypoints = waypoints.sort((a, b) => {
    if (a.type > b.type) return 1;
    else if (b.type < a.type) return -1;
    else if (a.type === b.type) {
      return a.symbol > b.symbol ? 1 : -1;
    } else return -1;
  });

  return (
    <>
      <div className="flex justify-center">
        <div>
          <h1 className="text-2xl text-secondary mb-6">
            System {params.system}
          </h1>
          <div className="grid gap-12 lg:grid-cols-4 lg:max-w-screen-xl md:grid-cols-2 sm:grid-cols-1">
            {sortedWaypoints.map((waypoint) => {
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
      <CardHeader>
        <h2 className="flex justify-between items-baseline flex-wrap gap-1 font-bold tracking-widest">
          {waypoint.type.replaceAll("_", " ")}{" "}
          <span className="text-muted-foreground text-sm tracking-normal">
            {waypointName}
          </span>
        </h2>
      </CardHeader>
      <CardContent>
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
            return (
              <li className="text-violetgray/90" key={trait.symbol}>
                {trait.name}
              </li>
            );
          })}
        </ul>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4">
        {localShips &&
          localShips.length > 0 &&
          localShips?.map((ship) => (
            <LocalShipActions
              key={ship.symbol}
              ship={ship}
              waypoint={waypoint}
            />
          ))}

        <SendShipMenu waypoint={waypoint.symbol} />
      </CardFooter>
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
        <Button variant={"secondary"} className="bg-secondary font-bold w-full">
          {ship.registration.role} - {ship.symbol.split("-")[1]}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] rounded-2xl p-4 sm:rounded-2xl bg-popover border-none h-3/4 flex flex-col">
        <DialogHeader className="px-4 py-1">
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
        <ScrollArea className="px-4">
          <div className="flex gap-5 flex-col px-4 items-start-start">
            {waypoint.type === "ASTEROID_FIELD" && <MineAction ship={ship} />}
            {ship.nav.status === "DOCKED" && <RefuelAction ship={ship} />}
            {ship.nav.status !== "IN_TRANSIT" && <FlightStatus ship={ship} />}
            {waypoint.traits.find(
              (trait: WaypointTrait) => trait.symbol === "MARKETPLACE"
            ) && <SellCargoAction ship={ship} />}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function FlightStatus({ ship }: { ship: Ship }) {
  // TODO: use orbit endpoint
  const { mutate: dockShip } = useDockShip(ship.symbol);
  const { mutate: orbitShip } = useOrbitShip(ship.symbol);

  const toggleDockedOrOrbit = () => {
    if (ship.nav.status === "IN_ORBIT") {
      dockShip();
    } else if (ship.nav.status === "DOCKED") {
      orbitShip();
    }
  };

  // TODO: use dock endpoint

  // const { mutate: orbit } = useOrbit(ship.symbol);
  const title = "Toggle Flight Mode";
  const description = "Toggle Orbiting or Docking";
  const FlightStatusDetails = () => (
    <h3>
      The ship is currently{" "}
      {ship.nav.status === "IN_ORBIT" ? "in orbit" : "docked"}.
    </h3>
  );
  return (
    <ShipAction
      title={title}
      description={description}
      content={<FlightStatusDetails />}
      clickHandler={toggleDockedOrOrbit}
    />
  );
}

function RefuelAction({ ship }: { ship: Ship }) {
  // TODO: use refuel endpoint
  // TODO: use market endpoint to check both the export price (if any) and the exchange price (if any)
  const { mutate: refuelShip } = useRefuelShip(ship.symbol);
  const fuelPrice = useFuelPrice(ship.nav.waypointSymbol);
  if (!fuelPrice) {
    return null;
  }
  const fuelNeeded = ship.fuel.capacity - ship.fuel.current;
  const priceToRefuel = Math.ceil(fuelNeeded / 100) * fuelPrice;
  // TODO: don't display this option if there is no fuel for sale

  // const { mutate: refuel } = useRefuel(ship.symbol);
  const title = "Refuel";
  const description = "Refuel for future travel";
  const FuelDetails = () => (
    <>
      <h3>
        Current fuel: {ship.fuel.current} / {ship.fuel.capacity}
      </h3>
      {fuelPrice && <div>Price to refuel: {priceToRefuel}</div>}
    </>
  );
  return (
    <ShipAction
      title={title}
      description={description}
      content={<FuelDetails />}
      clickHandler={refuelShip}
    />
  );
}

function MineAction({ ship }: { ship: Ship }) {
  // TODO: add a scan secondary button (if the ship has the module)
  // TODO: add a cooldown timer

  const { mutate: mineResource } = useMine(ship.symbol);
  const title = "Mine";
  const description = "Mine resources from an Astroid Field";
  const CargoDetails = () => (
    <>
      <h3>{`Cargo: ${ship?.cargo.units} / ${ship.cargo.capacity}`}</h3>
      {ship.cargo.units > 0 && (
        <ul className="cardsubsection">
          {ship.cargo.inventory.map((item) => (
            <li className="text-violetgray" key={item.name}>
              <span className="font-bold mr-1">{item.units}</span>
              {` ${item.name}`}
            </li>
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

function SellCargoAction({ ship }: { ship: Ship }) {
  const { mutate: sellCargo } = useSellAllCargo(
    ship.symbol,
    ship.cargo.inventory
  );

  const CargoDetails = () => (
    <>
      <h3>{`Cargo: ${ship?.cargo.units} / ${ship.cargo.capacity}`}</h3>
      {ship.cargo.units > 0 && (
        <ul className="cardsubsection">
          {ship.cargo.inventory.map((item) => (
            <li className="text-violetgray" key={item.name}>
              <span className="font-bold mr-1">{item.units}</span>
              {` ${item.name}`}
            </li>
          ))}
        </ul>
      )}
    </>
  );
  return (
    <ShipAction
      title={"Sell All Cargo"}
      description={
        "Sell all cargo currently held at the market at this location"
      }
      content={<CargoDetails />}
      clickHandler={sellCargo}
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
    <Card className="rounded-xl bg-spacegray">
      <CardHeader>
        <CardTitle className="text-violetgray">{title}</CardTitle>
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
    </Card>
  );
}

function ShipYardButton({ waypointSymbol }: { waypointSymbol: string }) {
  const { data: shipyardData } = useShipyard(waypointSymbol);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="font-bold w-full">
          SHIPYARD
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] rounded-2xl p-4 sm:rounded-2xl bg-popover border-none h-3/4">
        <DialogHeader className="p-4">
          <DialogTitle>
            <h2 className="text-lg font-semibold tracking-tight">Shipyard</h2>
          </DialogTitle>
          <DialogDescription>
            <p className="text-sm text-gray-100">
              See what ships are available to purchase
            </p>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="px-4">
          {shipyardData?.ships && (
            <div className="flex justify-start gap-5 flex-col px-4">
              {shipyardData.ships.map((ship) => (
                <Card key={ship.type} className="rounded-xl bg-spacegray">
                  <CardHeader>
                    <CardTitle>{ship.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-evenly text-violetgray">
                      <div>
                        <div className="font-medium -ml-2 text-violetgray">
                          Mounts:
                        </div>
                        {ship.mounts.map((mount) => (
                          <div
                            key={mount.symbol}
                            className="text-sm text-primary"
                          >
                            {mount.name}
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="font-medium -ml-2 text-violetgray ">
                          Engine:
                        </div>
                        <div className="text-gray-100">{ship.engine.name}</div>
                      </div>
                      <div>
                        <div className="font-medium -ml-2 text-violetgray ">
                          Price:
                        </div>
                        <div className="">{ship.purchasePrice}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <PurchaseShipButton
                      shipType={ship.type!}
                      waypoint={shipyardData.symbol}
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
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
