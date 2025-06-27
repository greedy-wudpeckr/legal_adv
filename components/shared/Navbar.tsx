"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HoveredLink, Menu, MenuItem } from "@/components/ui/navbar-menu";

export function SharedNavbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}>
      <Menu setActive={setActive}>
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-2 mr-8">
          <Image
            src="/Logo.png"
            alt="EduVerse Logo"
            width={32}
            height={32}
            className="rounded"
          />
          <span className="font-bold text-lg text-black hover:text-gray-700 transition-colors">
            EduVerse
          </span>
        </Link>

        {/* Home */}
        <Link href="/">
          <MenuItem setActive={setActive} active={active} item="Home">
          </MenuItem>
        </Link>

        {/* apnaWaqeel */}
        <MenuItem setActive={setActive} active={active} item="apnaWaqeel">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/legal">Legal Assistant</HoveredLink>
            <HoveredLink href="/courtroom-battle">Case Studies</HoveredLink>
            <HoveredLink href="/legal/documentation">Documentation</HoveredLink>
          </div>
        </MenuItem>

        {/* apniHistory */}
        <MenuItem setActive={setActive} active={active} item="apniHistory">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/apni-history/explore">Explore Figures</HoveredLink>
            <HoveredLink href="/apni-history/timeline">Timeline</HoveredLink>
            <HoveredLink href="/apni-history/ask">Ask History</HoveredLink>
            <HoveredLink href="/apni-history/documents">Historical Documents</HoveredLink>
          </div>
        </MenuItem>

        {/* About */}
        <Link href="/about">
          <MenuItem setActive={setActive} active={active} item="About">
          </MenuItem>
        </Link>

        {/* Contact */}
        <Link href="/contact">
          <MenuItem setActive={setActive} active={active} item="Contact">
          </MenuItem>
        </Link>
      </Menu>
    </div>
  );
}