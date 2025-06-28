"use client";

import React from "react";
import { SharedNavbar } from "@/components/shared/Navbar";

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export function Layout({ children, showNavbar = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {showNavbar && <SharedNavbar />}
      <main className={showNavbar ? "pt-20" : ""}>
        {children}
      </main>
    </div>
  );
}