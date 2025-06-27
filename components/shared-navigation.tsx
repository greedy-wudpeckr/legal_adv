"use client"

import { ArrowLeft, BookOpen, Scale, Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SharedNavigationProps {
  platform?: 'apnawaqeel' | 'apnihistory';
  breadcrumbs?: BreadcrumbItem[];
}

export default function SharedNavigation({ platform, breadcrumbs = [] }: SharedNavigationProps) {
  const pathname = usePathname();

  const getPlatformConfig = () => {
    if (platform === 'apnawaqeel') {
      return {
        name: 'apnaWaqeel',
        icon: Scale,
        href: '/legal',
        color: 'text-amber-600 hover:text-amber-700'
      };
    } else if (platform === 'apnihistory') {
      return {
        name: 'apniHistory',
        icon: BookOpen,
        href: '/apni-history',
        color: 'text-black hover:text-gray-700'
      };
    }
    return null;
  };

  const platformConfig = getPlatformConfig();

  return (
    <nav className="bg-white/95 shadow-sm backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Back to EduVerse */}
          <Link href="/" className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors group">
            <Home className="w-5 h-5" />
            <span className="font-medium group-hover:underline decoration-gray-300">EduVerse</span>
          </Link>

          
          {platformConfig && (
            <div className="flex items-center gap-3">
              <platformConfig.icon className={`w-8 h-8 ${platformConfig.color}`} />
              <Link href={platformConfig.href} className={`text-2xl font-bold ${platformConfig.color} hover:underline decoration-gray-300`}>
                {platformConfig.name}
              </Link>
            </div>
          )}

          {/* Right: Platform-specific navigation */}
          <div className="flex items-center gap-6">
            {platform === 'apnawaqeel' && (
              <Link
                href="/courtroom-battle"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  pathname.includes('/courtroom-battle')
                    ? 'bg-amber-100 text-amber-700 shadow-sm'
                    : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50 hover:underline decoration-gray-300'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>Courtroom Battle</span>
              </Link>
            )}
            
            {platform === 'apnihistory' && (
              <>
                <Link
                  href="/apni-history/explore"
                  className={`text-black hover:text-gray-700 hover:underline decoration-gray-300 transition-colors ${
                    pathname.includes('/explore') ? 'underline decoration-gray-300' : ''
                  }`}
                >
                  Explore Figures
                </Link>
                <Link
                  href="/apni-history/timeline"
                  className={`text-black hover:text-gray-700 hover:underline decoration-gray-300 transition-colors ${
                    pathname.includes('/timeline') ? 'underline decoration-gray-300' : ''
                  }`}
                >
                  Timeline
                </Link>
              </>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}