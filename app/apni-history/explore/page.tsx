"use client"

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Users, 
  Crown, 
  Filter,
  Search,
  Calendar,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { historicalFigures, historicalPeriods } from '@/data/historical-data';
import { HistoricalFigure } from '@/types/history';

const filterOptions = [
  { id: 'all', label: 'All Periods', count: historicalFigures.length },
  { id: 'ancient-india', label: 'Ancient India', count: historicalFigures.filter(f => f.period === 'ancient-india').length },
  { id: 'medieval-india', label: 'Medieval India', count: historicalFigures.filter(f => f.period === 'medieval-india').length },
  { id: 'modern-india', label: 'Modern India', count: historicalFigures.filter(f => f.period === 'modern-india').length }
];

export default function ExploreFiguresPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const filteredFigures = historicalFigures.filter(figure => {
    const matchesFilter = selectedFilter === 'all' || figure.period === selectedFilter;
    const matchesSearch = figure.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         figure.biography.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPeriodName = (periodId: string) => {
    const period = historicalPeriods.find(p => p.id === periodId);
    return period?.name || periodId;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/apni-history" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to History</span>
            </Link>
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-black" />
              <h1 className="text-2xl font-bold text-black">Explore Historical Figures</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Crown className="w-12 h-12 text-black" />
            <h1 className="text-4xl md:text-5xl font-bold text-black">
              Meet the Legends
            </h1>
          </div>
          <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto">
            Discover the extraordinary individuals who shaped Indian history
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From ancient emperors to modern freedom fighters, explore their stories, 
            achievements, and lasting impact on our civilization.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search historical figures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300 focus:border-black focus:ring-black"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedFilter(option.id)}
                className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                  selectedFilter === option.id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs opacity-75">({option.count})</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Figures Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {filteredFigures.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No figures found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-black mb-2">
                  {filteredFigures.length} Historical Figure{filteredFigures.length !== 1 ? 's' : ''}
                </h2>
                <p className="text-gray-600">
                  {selectedFilter === 'all' ? 'From all periods' : `From ${getPeriodName(selectedFilter)}`}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFigures.map((figure) => (
                  <div
                    key={figure.id}
                    className={`group cursor-pointer transition-all duration-300 ${
                      hoveredCard === figure.id ? 'scale-105' : 'hover:scale-102'
                    }`}
                    onMouseEnter={() => setHoveredCard(figure.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                      {/* Figure Avatar */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Crown className="w-16 h-16 text-black opacity-60" />
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 bg-white/90 text-xs font-medium text-gray-700 rounded-full">
                            {getPeriodName(figure.period)}
                          </span>
                        </div>
                      </div>

                      {/* Figure Info */}
                      <div className="p-6">
                        <div className="mb-3">
                          <h3 className="text-xl font-bold text-black mb-1">{figure.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{figure.timeRange}</span>
                          </div>
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                          {figure.biography.substring(0, 120)}...
                        </p>

                        {/* Key Achievements Preview */}
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                            Key Achievements
                          </h4>
                          <ul className="space-y-1">
                            {figure.achievements.slice(0, 2).map((achievement, index) => (
                              <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                <span className="line-clamp-1">{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <Link href={`/apni-history/chat/${figure.id}`} className="block">
                            <Button 
                              className="w-full bg-black hover:bg-gray-800 text-white transition-colors"
                              size="sm"
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Chat with {figure.name.split(' ')[0]}
                            </Button>
                          </Link>
                          
                          <Button 
                            variant="outline" 
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                            size="sm"
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Learn More
                          </Button>
                        </div>
                      </div>

                      {/* Hover Effect Overlay */}
                      <div className={`absolute inset-0 bg-gray-100 opacity-0 transition-opacity duration-300 ${
                        hoveredCard === figure.id ? 'opacity-5' : ''
                      } pointer-events-none`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-6 text-gray-400" />
          <h2 className="text-3xl font-bold text-black mb-4">
            Dive Deeper into History
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Each figure has a unique story to tell. Start a conversation and discover 
            the personal experiences that shaped their legendary status.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apni-history/timeline">
              <Button 
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 font-semibold"
              >
                Explore Timeline
              </Button>
            </Link>
            <Link href="/apni-history">
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 font-semibold"
              >
                Back to History Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}