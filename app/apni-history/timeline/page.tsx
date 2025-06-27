"use client"

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Clock, 
  Filter,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  Calendar,
  MapPin,
  Users,
  BookOpen,
  Crown,
  Sword,
  Scroll
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { historicalEvents, historicalPeriods } from '@/data/historical-data';
import { HistoricalEvent } from '@/types/history';

const timelineEvents = [
  {
    id: 'indus-valley',
    date: '3300 BCE',
    year: -3300,
    title: 'Indus Valley Civilization Begins',
    description: 'One of the world\'s earliest urban civilizations emerges in the northwestern regions of South Asia.',
    significance: 'Established the foundation of urban planning and trade networks in ancient India.',
    period: 'ancient-india',
    location: 'Harappa, Mohenjo-daro',
    keyFigures: [],
    type: 'civilization',
    consequences: ['Urban planning innovations', 'Advanced drainage systems', 'Trade with Mesopotamia']
  },
  {
    id: 'vedic-period',
    date: '1500 BCE',
    year: -1500,
    title: 'Vedic Period Begins',
    description: 'The composition of the Vedas begins, establishing the foundation of Hindu philosophy and culture.',
    significance: 'Laid the spiritual and cultural foundation of Indian civilization.',
    period: 'ancient-india',
    location: 'Northwestern India',
    keyFigures: [],
    type: 'cultural',
    consequences: ['Development of Sanskrit', 'Establishment of caste system', 'Vedic literature']
  },
  {
    id: 'buddha-birth',
    date: '563 BCE',
    year: -563,
    title: 'Birth of Buddha',
    description: 'Siddhartha Gautama, who would become the Buddha, is born in Lumbini.',
    significance: 'Founded Buddhism, one of the world\'s major religions.',
    period: 'ancient-india',
    location: 'Lumbini, Nepal',
    keyFigures: ['Buddha'],
    type: 'religious',
    consequences: ['Spread of Buddhism', 'Non-violence philosophy', 'Monastic traditions']
  },
  {
    id: 'mauryan-empire',
    date: '322 BCE',
    year: -322,
    title: 'Mauryan Empire Founded',
    description: 'Chandragupta Maurya establishes the Mauryan Empire, unifying most of the Indian subcontinent.',
    significance: 'First empire to unify most of India under a single rule.',
    period: 'ancient-india',
    location: 'Pataliputra (Patna)',
    keyFigures: ['Chandragupta Maurya', 'Chanakya'],
    type: 'political',
    consequences: ['Political unification', 'Administrative systems', 'Trade expansion']
  },
  {
    id: 'kalinga-war',
    date: '261 BCE',
    year: -261,
    title: 'Kalinga War',
    description: 'Emperor Ashoka fights the devastating Kalinga War, leading to his conversion to Buddhism.',
    significance: 'Transformed Ashoka from a conqueror to a benevolent ruler promoting non-violence.',
    period: 'ancient-india',
    location: 'Kalinga (Odisha)',
    keyFigures: ['Ashoka'],
    type: 'military',
    consequences: ['Ashoka\'s conversion to Buddhism', 'Promotion of non-violence', 'Buddhist missions']
  },
  {
    id: 'gupta-golden-age',
    date: '320 CE',
    year: 320,
    title: 'Gupta Golden Age Begins',
    description: 'The Gupta Empire ushers in a golden age of arts, science, and literature in ancient India.',
    significance: 'Marked the pinnacle of classical Indian civilization and cultural achievements.',
    period: 'ancient-india',
    location: 'Northern India',
    keyFigures: ['Chandragupta I', 'Samudragupta', 'Chandragupta II'],
    type: 'cultural',
    consequences: ['Scientific advances', 'Literary achievements', 'Artistic renaissance']
  },
  {
    id: 'delhi-sultanate',
    date: '1206 CE',
    year: 1206,
    title: 'Delhi Sultanate Established',
    description: 'Qutb-ud-din Aibak establishes the Delhi Sultanate, beginning Muslim rule in northern India.',
    significance: 'Introduced Islamic culture and administration to the Indian subcontinent.',
    period: 'medieval-india',
    location: 'Delhi',
    keyFigures: ['Qutb-ud-din Aibak'],
    type: 'political',
    consequences: ['Islamic architecture', 'Cultural synthesis', 'Administrative changes']
  },
  {
    id: 'mughal-empire',
    date: '1526 CE',
    year: 1526,
    title: 'Mughal Empire Founded',
    description: 'Babur defeats Ibrahim Lodi at the Battle of Panipat, establishing the Mughal Empire.',
    significance: 'Began the Mughal dynasty that would rule India for over 300 years.',
    period: 'medieval-india',
    location: 'Panipat, Haryana',
    keyFigures: ['Babur', 'Ibrahim Lodi'],
    type: 'military',
    consequences: ['Mughal architecture', 'Cultural renaissance', 'Administrative reforms']
  },
  {
    id: 'akbar-reign',
    date: '1556 CE',
    year: 1556,
    title: 'Akbar Becomes Emperor',
    description: 'Akbar ascends to the Mughal throne and begins his policy of religious tolerance.',
    significance: 'Promoted religious harmony and cultural synthesis in medieval India.',
    period: 'medieval-india',
    location: 'Delhi, Agra',
    keyFigures: ['Akbar'],
    type: 'political',
    consequences: ['Religious tolerance', 'Din-i Ilahi', 'Administrative efficiency']
  },
  {
    id: 'taj-mahal',
    date: '1632 CE',
    year: 1632,
    title: 'Taj Mahal Construction Begins',
    description: 'Shah Jahan begins construction of the Taj Mahal as a mausoleum for his wife Mumtaz Mahal.',
    significance: 'Created one of the world\'s most beautiful architectural monuments.',
    period: 'medieval-india',
    location: 'Agra',
    keyFigures: ['Shah Jahan', 'Mumtaz Mahal'],
    type: 'cultural',
    consequences: ['Architectural masterpiece', 'Symbol of love', 'Tourist attraction']
  },
  {
    id: 'battle-of-plassey',
    date: '1757 CE',
    year: 1757,
    title: 'Battle of Plassey',
    description: 'British East India Company defeats Siraj-ud-Daulah, establishing British dominance in Bengal.',
    significance: 'Marked the beginning of British colonial rule in India.',
    period: 'modern-india',
    location: 'Plassey, Bengal',
    keyFigures: ['Robert Clive', 'Siraj-ud-Daulah'],
    type: 'military',
    consequences: ['British colonial rule', 'Economic exploitation', 'Cultural impact']
  },
  {
    id: 'revolt-1857',
    date: '1857 CE',
    year: 1857,
    title: 'Indian Rebellion of 1857',
    description: 'A major uprising against British rule begins, also known as the First War of Independence.',
    significance: 'First organized resistance against British colonial rule.',
    period: 'modern-india',
    location: 'Northern India',
    keyFigures: ['Rani Lakshmibai', 'Mangal Pandey', 'Bahadur Shah Zafar'],
    type: 'military',
    consequences: ['End of Company rule', 'Crown rule begins', 'Nationalist awakening']
  },
  {
    id: 'congress-formation',
    date: '1885 CE',
    year: 1885,
    title: 'Indian National Congress Founded',
    description: 'The Indian National Congress is formed to seek greater Indian participation in government.',
    significance: 'Became the primary vehicle for the Indian independence movement.',
    period: 'modern-india',
    location: 'Mumbai',
    keyFigures: ['Allan Octavian Hume', 'Dadabhai Naoroji'],
    type: 'political',
    consequences: ['Organized nationalism', 'Political awakening', 'Independence movement']
  },
  {
    id: 'partition-bengal',
    date: '1905 CE',
    year: 1905,
    title: 'Partition of Bengal',
    description: 'British divide Bengal into two provinces, sparking widespread protests and the Swadeshi movement.',
    significance: 'Catalyzed the nationalist movement and introduced new forms of resistance.',
    period: 'modern-india',
    location: 'Bengal',
    keyFigures: ['Lord Curzon'],
    type: 'political',
    consequences: ['Swadeshi movement', 'Boycott of British goods', 'National awakening']
  },
  {
    id: 'gandhi-return',
    date: '1915 CE',
    year: 1915,
    title: 'Gandhi Returns to India',
    description: 'Mahatma Gandhi returns from South Africa and begins his leadership of the independence movement.',
    significance: 'Introduced non-violent resistance as the primary method of struggle.',
    period: 'modern-india',
    location: 'Mumbai',
    keyFigures: ['Mahatma Gandhi'],
    type: 'political',
    consequences: ['Non-violent resistance', 'Mass movements', 'Moral leadership']
  },
  {
    id: 'quit-india',
    date: '1942 CE',
    year: 1942,
    title: 'Quit India Movement',
    description: 'Gandhi launches the Quit India Movement demanding immediate independence from British rule.',
    significance: 'Final major movement that accelerated the end of British rule.',
    period: 'modern-india',
    location: 'All India',
    keyFigures: ['Mahatma Gandhi', 'Subhas Chandra Bose'],
    type: 'political',
    consequences: ['Mass arrests', 'International pressure', 'Acceleration toward independence']
  },
  {
    id: 'independence',
    date: '1947 CE',
    year: 1947,
    title: 'Indian Independence',
    description: 'India gains independence from British rule, but is partitioned into India and Pakistan.',
    significance: 'End of colonial rule and birth of modern India.',
    period: 'modern-india',
    location: 'New Delhi',
    keyFigures: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'Muhammad Ali Jinnah'],
    type: 'political',
    consequences: ['Independence achieved', 'Partition trauma', 'Modern nation-state']
  }
];

const filterOptions = [
  { id: 'all', label: 'All Events', count: timelineEvents.length },
  { id: 'ancient-india', label: 'Ancient India', count: timelineEvents.filter(e => e.period === 'ancient-india').length },
  { id: 'medieval-india', label: 'Medieval India', count: timelineEvents.filter(e => e.period === 'medieval-india').length },
  { id: 'modern-india', label: 'Modern India', count: timelineEvents.filter(e => e.period === 'modern-india').length }
];

const eventTypeFilters = [
  { id: 'all-types', label: 'All Types', icon: BookOpen },
  { id: 'political', label: 'Political', icon: Crown },
  { id: 'military', label: 'Military', icon: Sword },
  { id: 'cultural', label: 'Cultural', icon: Scroll },
  { id: 'religious', label: 'Religious', icon: BookOpen },
  { id: 'civilization', label: 'Civilization', icon: Users }
];

export default function TimelinePage() {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedEventType, setSelectedEventType] = useState('all-types');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredEvents = timelineEvents.filter(event => {
    const periodMatch = selectedPeriod === 'all' || event.period === selectedPeriod;
    const typeMatch = selectedEventType === 'all-types' || event.type === selectedEventType;
    return periodMatch && typeMatch;
  });

  const sortedEvents = filteredEvents.sort((a, b) => a.year - b.year);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'political': return Crown;
      case 'military': return Sword;
      case 'cultural': return Scroll;
      case 'religious': return BookOpen;
      case 'civilization': return Users;
      default: return BookOpen;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'political': return 'border-blue-300 bg-blue-50';
      case 'military': return 'border-red-300 bg-red-50';
      case 'cultural': return 'border-purple-300 bg-purple-50';
      case 'religious': return 'border-green-300 bg-green-50';
      case 'civilization': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getPeriodName = (periodId: string) => {
    const period = historicalPeriods.find(p => p.id === periodId);
    return period?.name || periodId;
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const scrollToEvent = (eventId: string) => {
    const element = document.getElementById(`event-${eventId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/apni-history" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to History</span>
            </Link>
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-black" />
              <h1 className="text-2xl font-bold text-black">Historical Timeline</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b border-gray-200 py-4 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Period Filters */}
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedPeriod(option.id)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 text-sm ${
                    selectedPeriod === option.id
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

            {/* Event Type Filters */}
            <div className="flex flex-wrap gap-2">
              {eventTypeFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedEventType(filter.id)}
                    className={`px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                      selectedEventType === filter.id
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{filter.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Zoom Controls */}
            {!isMobile && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 px-2">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your filter criteria</p>
          </div>
        ) : (
          <>
            {/* Timeline Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">
                {sortedEvents.length} Historical Event{sortedEvents.length !== 1 ? 's' : ''}
              </h2>
              <p className="text-gray-600">
                {selectedPeriod === 'all' ? 'From all periods' : `From ${getPeriodName(selectedPeriod)}`}
                {selectedEventType !== 'all-types' && ` • ${selectedEventType} events`}
              </p>
            </div>

            {/* Desktop Timeline */}
            {!isMobile ? (
              <div 
                ref={timelineRef}
                className="relative overflow-x-auto"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
              >
                {/* Timeline Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-300 h-full"></div>
                
                <div className="space-y-12 py-8">
                  {sortedEvents.map((event, index) => {
                    const Icon = getEventIcon(event.type);
                    const isLeft = index % 2 === 0;
                    const isSelected = selectedEvent === event.id;
                    const isHovered = hoveredEvent === event.id;
                    
                    return (
                      <div
                        key={event.id}
                        id={`event-${event.id}`}
                        className="relative flex items-center"
                        onMouseEnter={() => setHoveredEvent(event.id)}
                        onMouseLeave={() => setHoveredEvent(null)}
                      >
                        {/* Timeline Node */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                          <div 
                            className={`w-6 h-6 rounded-full border-4 border-white transition-all duration-300 cursor-pointer ${
                              isSelected || isHovered 
                                ? 'bg-black scale-125 shadow-lg shadow-gray-400' 
                                : 'bg-black hover:scale-110'
                            }`}
                            onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                          >
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                              <div className="w-2 h-2 bg-black rounded-full"></div>
                            </div>
                          </div>
                        </div>

                        {/* Event Card */}
                        <div className={`w-5/12 ${isLeft ? 'mr-auto pr-8' : 'ml-auto pl-8'}`}>
                          <div 
                            className={`bg-white border-l-4 border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                              isSelected ? 'shadow-lg scale-105' : ''
                            } ${getEventColor(event.type)}`}
                            onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                          >
                            {/* Event Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg border border-gray-200">
                                  <Icon className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-600 mb-1">{event.date}</div>
                                  <h3 className="text-lg font-bold text-black">{event.title}</h3>
                                </div>
                              </div>
                            </div>

                            {/* Event Description */}
                            <p className="text-gray-700 text-sm leading-relaxed mb-4">
                              {event.description}
                            </p>

                            {/* Event Details */}
                            <div className="space-y-2 text-xs text-gray-600">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                <span>{event.location}</span>
                              </div>
                              {event.keyFigures.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <Users className="w-3 h-3" />
                                  <span>{event.keyFigures.join(', ')}</span>
                                </div>
                              )}
                            </div>

                            {/* Expanded Details */}
                            {isSelected && (
                              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                                <div>
                                  <h4 className="font-semibold text-black mb-2">Historical Significance</h4>
                                  <p className="text-sm text-gray-700">{event.significance}</p>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold text-black mb-2">Consequences</h4>
                                  <ul className="space-y-1">
                                    {event.consequences.map((consequence, idx) => (
                                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                        <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                        {consequence}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Connection Line */}
                        <div className={`absolute top-1/2 transform -translate-y-1/2 w-8 h-px bg-gray-300 ${
                          isLeft ? 'right-1/2 mr-3' : 'left-1/2 ml-3'
                        }`}></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Mobile Timeline */
              <div className="space-y-6">
                {/* Timeline Line */}
                <div className="absolute left-8 w-px bg-gray-300 h-full"></div>
                
                {sortedEvents.map((event, index) => {
                  const Icon = getEventIcon(event.type);
                  const isSelected = selectedEvent === event.id;
                  
                  return (
                    <div key={event.id} className="relative flex items-start gap-6">
                      {/* Timeline Node */}
                      <div className="relative z-10 flex-shrink-0">
                        <div 
                          className={`w-6 h-6 rounded-full border-4 border-white transition-all duration-300 cursor-pointer ${
                            isSelected 
                              ? 'bg-black scale-125 shadow-lg shadow-gray-400' 
                              : 'bg-black hover:scale-110'
                          }`}
                          onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                        >
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-black rounded-full"></div>
                          </div>
                        </div>
                      </div>

                      {/* Event Card */}
                      <div className="flex-1">
                        <div 
                          className={`bg-white border-l-4 border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                            isSelected ? 'shadow-lg' : ''
                          } ${getEventColor(event.type)}`}
                          onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                        >
                          {/* Event Header */}
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-white rounded-lg border border-gray-200">
                              <Icon className="w-4 h-4 text-black" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-600 mb-1">{event.date}</div>
                              <h3 className="text-lg font-bold text-black">{event.title}</h3>
                            </div>
                          </div>

                          {/* Event Description */}
                          <p className="text-gray-700 text-sm leading-relaxed mb-3">
                            {event.description}
                          </p>

                          {/* Event Details */}
                          <div className="space-y-2 text-xs text-gray-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              <span>{event.location}</span>
                            </div>
                            {event.keyFigures.length > 0 && (
                              <div className="flex items-center gap-2">
                                <Users className="w-3 h-3" />
                                <span>{event.keyFigures.join(', ')}</span>
                              </div>
                            )}
                          </div>

                          {/* Expanded Details */}
                          {isSelected && (
                            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                              <div>
                                <h4 className="font-semibold text-black mb-2">Historical Significance</h4>
                                <p className="text-sm text-gray-700">{event.significance}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-black mb-2">Consequences</h4>
                                <ul className="space-y-1">
                                  {event.consequences.map((consequence, idx) => (
                                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                      <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                      {consequence}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation Help */}
      <div className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-lg font-semibold text-black mb-4">Explore the Timeline</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 bg-black rounded-full"></div>
              <span>Click timeline nodes to expand event details</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Filter className="w-4 h-4" />
              <span>Use filters to focus on specific periods or event types</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ZoomIn className="w-4 h-4" />
              <span>Zoom controls available on desktop for better viewing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}