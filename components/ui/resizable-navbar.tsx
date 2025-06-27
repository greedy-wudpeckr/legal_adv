"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../ui/navbar-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";


export function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-4 inset-x-0  max-w-2xl mx-auto z-[9999]", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Law">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/legal">LegalAdvisor</HoveredLink>
            <HoveredLink href="/courtroom-battle">CourtRoomBattle</HoveredLink>
            {/* <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
            <HoveredLink href="/branding">Branding</HoveredLink> */}
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="History">
        <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/apni-history">ApniHistory</HoveredLink>
             <HoveredLink href="/apni-history/explore">Explore Historical Figures</HoveredLink>
  </div>
        </MenuItem>
<MenuItem setActive={setActive} active={active} item="Get Started">
<div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/contact">Log In</HoveredLink>
             <HoveredLink href="/contact">Sign Up</HoveredLink>
              <HoveredLink href="/contact">Contact Us</HoveredLink>
  </div>
</MenuItem>

      </Menu>
    </div>
  );
}
