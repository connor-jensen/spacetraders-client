'use client'

import Link from "next/link";
import { useState } from "react";
import { useSelectedLayoutSegment } from 'next/navigation'
import clsx from "clsx";
import { useAgent } from "@/hooks/agentHooks";

export default function Header() {

  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false)

  return (
    <header className="h-[64px] sticky top-0 z-50 flex flex-col w-full antialiased backdrop-blur-sm bg-black/50">
      <nav className="mb-[-1px] h-full flex items-center justify-between w-full max-w-screen-xl px-4 mx-auto">
        <div className="flex item-center gap-8 ml-[44px]">
          <HeaderLink slug="fleet">Fleet</HeaderLink>
          <HeaderLink slug="map">Map</HeaderLink>
          <HeaderLink slug="contracts">Contracts</HeaderLink>
        </div>
        <AgentMiniInfo />
      </nav>
    </header>
  )
}

function HeaderLink({
  slug,
  children
}: {
  slug: string,
  children: React.ReactNode
}) {
  const segment = useSelectedLayoutSegment()
  const isActive = slug === segment

  return (
    <Link href={`/${slug}`} className={clsx("text-lg transition-colors duration-200", {
      'text-goldstar': isActive,
      'text-gray-400 hover:text-gray-700' :!isActive
    })}>{children}</Link>
  )
}

function AgentMiniInfo() {
  const { data, isLoading } = useAgent()

  if (isLoading) {
    return null
  }

  return (
    <div className="text-gray-400 flex items-center">
      <div>Credits:</div>
      <div className="text-gray-300 ml-2">{data?.credits}</div>
    </div>
  )
}