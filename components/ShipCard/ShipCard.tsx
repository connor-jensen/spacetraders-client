"use client";

import {
  useDockShip,
  useMine,
  useOrbitShip,
  useSellAllCargo,
  useShip,
  useShipCooldown,
} from "@/hooks/fleetHooks";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Cooldown, Ship } from "@/spacetraders-sdk-old/src";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  DollarSign,
  Fuel,
  Info,
  Microscope,
  Navigation,
  Orbit,
  RefreshCcw,
  Settings2,
} from "lucide-react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

export default function ShipCard({ ship }: { ship: Ship }) {
  const { mutate: dockShip } = useDockShip(ship.symbol);
  const { mutate: orbitShip } = useOrbitShip(ship.symbol);
  const { mutate: mine } = useMine(ship.symbol);
  const { mutate: sellCargo } = useSellAllCargo(
    ship.symbol,
    ship.cargo.inventory
  );
  const { data: cooldownData } = useShipCooldown(ship.symbol);

  const onCooldown = cooldownData && cooldownData.remainingSeconds > 0;

  const toggleDockedOrOrbit = () => {
    if (ship.nav.status === "IN_ORBIT") {
      dockShip();
    } else if (ship.nav.status === "DOCKED") {
      orbitShip();
    }
  };

  if (!ship) return <div>Error: No ship data</div>;
  return (
    <Card className="w-[38rem] p-6 shrink-0">
      <CardHeader className="flex flex-row justify-between p-0">
        <div className="flex flex-col flex-wrap gap-1 font-bold tracking-widest">
          <h2>{ship.registration.role} </h2>
          <span className="text-muted-foreground text-sm tracking-normal">
            {ship.symbol}
          </span>
        </div>
        {ship.nav.status !== "IN_TRANSIT" && (
          <Button variant={"ghost"}>
            <Link
              className="underline underline-offset-4 text-secondary flex gap-2 items-center"
              href={`/systems/${ship.nav.systemSymbol}`}
            >
              <Orbit className="opacity-80" />
              <span className="font-bold">{ship.nav.waypointSymbol}</span>
              {/* {ship.nav.waypointSymbol} */}
            </Link>
          </Button>
        )}
        <div className="flex items-center space-x-2">
          <Label
            htmlFor="docked-status"
            className={
              ship.nav.status === "IN_ORBIT"
                ? "font-semibold text-primary/90"
                : "text-muted-foreground/70"
            }
          >
            In Orbit
          </Label>
          <Switch
            id="docked-status"
            className="data-[state=checked]:bg-input"
            onClick={toggleDockedOrOrbit}
            checked={ship.nav.status === "DOCKED"}
          />
          <Label
            htmlFor="docked-status"
            className={
              ship.nav.status === "DOCKED"
                ? "font-semibold text-primary/90"
                : "text-muted-foreground/70"
            }
          >
            Docked
          </Label>
        </div>
      </CardHeader>
      <CardContent className="rounded-xl mt-4 h-72 p-0 flex-none">
        <div className="flex gap-4 justify-between h-full place-content-center">
          <div className="bg-popover p-4 grid rounded-xl gap-4 grid-cols-3 w-fit">
            <ToolTipWrapper tooltipText="Mine">
              <Button
                className="h-16 w-20"
                variant={"ghost"}
                disabled={ship.nav.status !== "IN_ORBIT"}
                onClick={() => mine()}
              >
                <div className="flex flex-col gap-1 items-center">
                  <svg
                    width="80%"
                    height="80%"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-muted-foreground"
                  >
                    <path
                      d="M5.04697 2.16705C10.921 6.2495 15.9945 11.638 19.9767 18.0236"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M13.5789 10.9392L5.45963 19.3817C4.66681 20.2061 3.38683 20.2061 2.59401 19.3817C2.4057 19.1861 2.25631 18.9539 2.15439 18.6983C2.05246 18.4426 2 18.1686 2 17.8918C2 17.6151 2.05246 17.3411 2.15439 17.0854C2.25631 16.8298 2.4057 16.5975 2.59401 16.402L10.7133 7.95944"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M20 18C20 18 20 17.0566 20 15.5283C20 14 19.6618 11.9934 19.0047 10.3529C18.3476 8.71248 17.3846 7.22255 16.1709 5.96857C14.961 4.71064 13.5234 3.71257 11.9406 3.03156C10.3578 2.35055 8.66085 2 6.94708 2C6.32296 2 5.66317 2.04649 5 2.1385"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <Progress className="h-1" value={50} />
                </div>
              </Button>
            </ToolTipWrapper>
            <Button className="h-16 w-20" variant={"ghost"}>
              <Fuel
                height={"80%"}
                width={"80%"}
                className="stroke-muted-foreground"
              />
            </Button>
            <Button className="h-16 w-20" variant={"ghost"}>
              <Navigation
                height={"80%"}
                width={"80%"}
                className="stroke-muted-foreground"
              />
            </Button>
            <Button className="h-16 w-20" variant={"ghost"}>
              <Orbit
                height={"80%"}
                width={"80%"}
                className="stroke-muted-foreground"
              />
            </Button>
            <Button className="h-16 w-20" variant={"ghost"}>
              <Settings2
                height={"80%"}
                width={"80%"}
                className="stroke-muted-foreground"
              />
            </Button>
            <Button className="h-16 w-20" variant={"ghost"}>
              <Microscope
                height={"80%"}
                width={"80%"}
                className="stroke-muted-foreground"
              />
            </Button>
            <Button className="h-16 w-20" variant={"ghost"}>
              <Info
                height={"80%"}
                width={"80%"}
                className="stroke-muted-foreground"
              />
            </Button>
            <Button
              className="h-16 w-20"
              variant={"ghost"}
              onClick={() => sellCargo()}
              disabled={ship.nav.status !== "DOCKED"}
            >
              <DollarSign
                height={"80%"}
                width={"80%"}
                className="stroke-muted-foreground"
              />
            </Button>
            <Button className="h-16 w-20" variant={"ghost"}>
              <RefreshCcw
                height={"80%"}
                width={"80%"}
                className="stroke-muted-foreground"
              />
            </Button>
          </div>
          <div className="flex-1 py-2 flex flex-col">
            {ship.fuel.capacity > 0 && (
              <div className="flex gap-2 items-center">
                <Fuel className="stroke-muted-foreground" />
                <Progress
                  value={(ship.fuel.current / ship.fuel.capacity) * 100}
                />
              </div>
            )}
            <h3 className="mt-3">{`Cargo: ${ship?.cargo.units} / ${ship.cargo.capacity}`}</h3>
            {ship.cargo.units > 0 && (
              <ScrollArea className="">
                <ScrollBar />
                <ul className="cardsubsection">
                  {ship.cargo.inventory.map((item) => (
                    <li className="text-violetgray" key={item.name}>
                      <span className="font-bold mr-1">{item.units}</span>
                      {` ${item.name}`}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </div>
        </div>
        {cooldownData && <CooldownProgress cooldown={cooldownData} />}
      </CardContent>
    </Card>
  );
}

function CooldownProgress({ cooldown }: { cooldown: Cooldown }) {
  // get seconds remainig from date
  // const getSecondsRemaining = (date: Date) => {
  //   const now = new Date();
  //   const diff = date.getTime() - now.getTime();
  //   return Math.floor(diff / 1000);
  // };

  // const [secondsLeft, setSecondsLeft] = useState(
  //   getSecondsRemaining(new Date(cooldown.expiration))
  // );

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setSecondsLeft((s) => s - 1);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [cooldown.expiration]);

  // return <Progress value={(secondsLeft/cooldown.totalSeconds) * 100} className="h-2 mt-2" />;
  return <Progress value={50} className="h-2 mt-2" />;

}

function ToolTipWrapper({
  tooltipText,
  children,
}: {
  tooltipText: string;
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
