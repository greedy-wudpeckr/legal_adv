"use client"

import { Gavel, Scale } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { href: '/courtroom-battle', label: 'Courtroom Battle', icon: Gavel },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="top-0 right-0 left-0 z-50 fixed bg-white/95 shadow-sm backdrop-blur-sm border-amber-200 border-b">
      <div className="mx-auto px-6 max-w-6xl">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Scale className="w-8 h-8 text-amber-600" />
            <span className="font-bold text-gray-800 text-xl">ApnaWakeel.ai</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-100 text-amber-700 shadow-sm'
                      : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}