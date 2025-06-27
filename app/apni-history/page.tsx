"use client"

import { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  Users, 
  FileText, 
  MessageSquare,
  ChevronRight,
  Sparkles,
  Calendar,
  Crown,
  Scroll,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { historicalPeriods, historicalFigures } from '@/data/historical-data';
import QuickFactsCard from '@/components/ui/quick-facts-card';
import SettingsPanel from '@/components/ui/settings-panel';
import HelpOverlay from '@/components/ui/help-overlay';
import TimelinePage from '@/components/ui/Timeline';

const navigationCards = [
  {
    id: 'explore-figures',
    title: 'Explore Figures',
    description: 'Meet legendary personalities who shaped Indian history',
    icon: Users,
    href: '/apni-history/explore',
    color: 'text-gray-700',
    count: historicalFigures.length
  },
  {
    id: 'timeline',
    title: 'Timeline',
    description: 'Journey through chronological events and eras',
    icon: Clock,
    href: '/apni-history/timeline',
    color: 'text-gray-700',
    count: '3000+ years'
  },
  // {
  //   id: 'ask-history',
  //   title: 'Ask History',
  //   description: 'Get answers to your historical questions from AI',
  //   icon: MessageSquare,
  //   href: '/apni-history/ask',
  //   color: 'text-gray-700',
  //   count: 'AI Powered'
  // },
  // {
  //   id: 'documents',
  //   title: 'Historical Documents',
  //   description: 'Explore primary sources and ancient texts',
  //   icon: FileText,
  //   href: '/apni-history/documents',
  //   color: 'text-gray-700',
  //   count: 'Primary Sources'
  // }
];

const helpSections = [
  {
    title: 'Getting Started',
    content: 'Learn how to navigate the historical learning platform and interact with historical figures.',
    steps: [
      'Choose a historical figure from the explore section',
      'Start a conversation to learn about their experiences',
      'Use the timeline to understand chronological context',
      'Explore primary documents for deeper insights'
    ]
  },
  {
    title: 'Chat Features',
    content: 'Make the most of your conversations with historical personalities.',
    steps: [
      'Ask specific questions about their time period',
      'Inquire about their personal experiences and decisions',
      'Request advice based on their historical wisdom',
      'Use suggested questions to guide your conversation'
    ]
  },
  {
    title: 'Timeline Navigation',
    content: 'Understand how to use the interactive timeline effectively.',
    steps: [
      'Filter events by time period or type',
      'Click on timeline nodes to expand event details',
      'Use zoom controls for better viewing on desktop',
      'Explore connections between different events'
    ]
  }
];

export default function ApniHistoryPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100/20 to-gray-200/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-black rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-black">
              Discover History
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto">
            Journey through time and explore the rich tapestry of Indian civilization
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            From ancient empires to modern independence, experience history through 
            interactive storytelling and immersive learning.
          </p>
          
        
        </div>
      </section>

      {/* Historical Periods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Historical Periods
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the major eras that shaped Indian civilization and culture
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {historicalPeriods.map((period) => (
              <div
                key={period.id}
                className={`group cursor-pointer transition-all duration-300 ${
                  selectedPeriod === period.id ? 'scale-105' : 'hover:scale-102'
                }`}
                onClick={() => setSelectedPeriod(selectedPeriod === period.id ? null : period.id)}
              >
                <div className="bg-white border border-gray-200 rounded-lg p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <Crown className="w-6 h-6 text-black" />
                    <h3 className="text-xl font-bold text-black">{period.name}</h3>
                  </div>
                  <div className="text-sm font-medium text-gray-600 mb-3">{period.timeRange}</div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{period.description}</p>
                  
                  {selectedPeriod === period.id && (
                    <div className="space-y-3 border-t border-gray-200 pt-4">
                      <div>
                        <h4 className="font-semibold text-black mb-2">Key Events:</h4>
                        <ul className="space-y-1">
                          {period.keyEvents.slice(0, 2).map((event, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                              {event}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-500">Click to explore</span>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                      selectedPeriod === period.id ? 'rotate-90' : 'group-hover:translate-x-1'
                    }`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Figures Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Meet Historical Legends
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the personalities who shaped the course of Indian history
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {historicalFigures.map((figure) => (
              <Link key={figure.id} href={`/apni-history/chat/${figure.id}`}>
                <div className="group cursor-pointer transition-all duration-300 hover:scale-105">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="font-bold text-black mb-2">{figure.name}</h3>
                    <div className="text-sm text-gray-600 mb-2">{figure.timeRange}</div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {figure.biography.substring(0, 100)}...
                    </p>
                    <div className="mt-4 text-xs text-gray-400">
                      Click to chat
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TimelinePage/>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Scroll className="w-16 h-16 mx-auto mb-6 text-gray-300" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Dive deep into the fascinating world of Indian history and discover 
            the stories that shaped our civilization.
          </p>
        </div>
      </section>


      {/* Modals */}
      <SettingsPanel 
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
        theme="monochrome"
      />
      
      <HelpOverlay
        isVisible={showHelp}
        onClose={() => setShowHelp(false)}
        title="apniHistory Help"
        sections={helpSections}
        theme="monochrome"
      />
    </div>
  );
}