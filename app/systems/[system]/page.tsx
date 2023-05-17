"use client";

import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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

export default function SystemPage({ params }: { params: { system: string } }) {
  const { data: waypoints, isLoading } = useWaypoints(params.system);

  if (!waypoints || isLoading) {
    return null;
  }

  console.log(waypoints);

  return (
    <div className="flex justify-center">
      <div className="grid gap-4 lg:grid-cols-4 lg:max-w-7xl md:grid-cols-2 sm:grid-cols-1">
        {waypoints.map((waypoint) => (
          <WaypointCard key={waypoint.symbol} waypoint={waypoint} />
        ))}
      </div>
    </div>
  );
}

function WaypointCard({ waypoint }: { waypoint: Waypoint }) {
  return (
    <Card>
      <h2>{waypoint.symbol}</h2>
      <ul>
        {waypoint.traits.map((trait) => {
          if (trait.symbol === "SHIPYARD") {
            return (
              <ShipYardButton
                key={waypoint.symbol}
                trait={trait.symbol}
                waypointSymbol={waypoint.symbol}
              />
            );
          } else return <li key={trait.symbol}>{trait.name}</li>;
        })}
      </ul>
      <SendShipMenu waypoint={waypoint.symbol} />
    </Card>
  );
}

function ShipYardButton({
  trait,
  waypointSymbol,
}: {
  trait: String;
  waypointSymbol: string;
}) {
  const { data: shipyardData } = useShipyard(waypointSymbol);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="bg-goldstar font-bold w-full">
          {trait}
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
        <SendShipGroup shipGroup={command} groupName="COMMAND" destinationWaypoint={waypoint} />
        <SendShipGroup shipGroup={surveyors} groupName="SURVEYOR" destinationWaypoint={waypoint}/>
        <SendShipGroup shipGroup={excavators} groupName="EXCAVATOR" destinationWaypoint={waypoint}/>
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
  destinationWaypoint: string
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
                <SendShipItem key={ship.symbol} ship={ship} destinationWaypoint={destinationWaypoint}/>
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
