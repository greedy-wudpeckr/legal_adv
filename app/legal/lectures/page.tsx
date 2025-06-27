"use client"

import { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Search, 
  Filter,
  ChevronDown,
  ChevronRight,
  Play,
  Clock,
  Users,
  Star,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SharedNavigation from '@/components/shared-navigation';

interface Lecture {
  id: string;
  title: string;
  duration: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  views: number;
  rating: number;
}

interface LectureTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  totalLectures: number;
  totalDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lectures: Lecture[];
  color: string;
}

const lectureTopics: LectureTopic[] = [
  {
    id: 'fundamental-rights',
    title: 'Fundamental Rights',
    description: 'Understanding the basic rights guaranteed by the Indian Constitution',
    category: 'Constitutional Law',
    totalLectures: 8,
    totalDuration: '4h 30m',
    difficulty: 'beginner',
    color: 'from-blue-500 to-indigo-600',
    lectures: [
      {
        id: 'fr-1',
        title: 'Introduction to Fundamental Rights',
        duration: '35 min',
        description: 'Overview of fundamental rights and their importance in Indian democracy',
        difficulty: 'beginner',
        views: 1250,
        rating: 4.8
      },
      {
        id: 'fr-2',
        title: 'Right to Equality (Articles 14-18)',
        duration: '42 min',
        description: 'Detailed analysis of equality provisions and landmark cases',
        difficulty: 'beginner',
        views: 980,
        rating: 4.7
      },
      {
        id: 'fr-3',
        title: 'Right to Freedom (Articles 19-22)',
        duration: '38 min',
        description: 'Freedom of speech, assembly, and personal liberty',
        difficulty: 'intermediate',
        views: 875,
        rating: 4.9
      },
      {
        id: 'fr-4',
        title: 'Right against Exploitation (Articles 23-24)',
        duration: '28 min',
        description: 'Protection against forced labor and child labor',
        difficulty: 'beginner',
        views: 720,
        rating: 4.6
      }
    ]
  },
  {
    id: 'ipc-sections',
    title: 'IPC Sections',
    description: 'Key sections of the Indian Penal Code with practical applications',
    category: 'Criminal Law',
    totalLectures: 12,
    totalDuration: '6h 15m',
    difficulty: 'intermediate',
    color: 'from-red-500 to-pink-600',
    lectures: [
      {
        id: 'ipc-1',
        title: 'Introduction to IPC',
        duration: '30 min',
        description: 'History, structure, and basic principles of Indian Penal Code',
        difficulty: 'beginner',
        views: 1450,
        rating: 4.7
      },
      {
        id: 'ipc-2',
        title: 'Offences Against Human Body (Sections 299-377)',
        duration: '45 min',
        description: 'Murder, culpable homicide, assault, and related offences',
        difficulty: 'intermediate',
        views: 1120,
        rating: 4.8
      },
      {
        id: 'ipc-3',
        title: 'Offences Against Property (Sections 378-462)',
        duration: '40 min',
        description: 'Theft, robbery, dacoity, and property-related crimes',
        difficulty: 'intermediate',
        views: 890,
        rating: 4.6
      }
    ]
  },
  {
    id: 'contract-law',
    title: 'Contract Law',
    description: 'Principles of contract formation, performance, and breach',
    category: 'Civil Law',
    totalLectures: 10,
    totalDuration: '5h 20m',
    difficulty: 'intermediate',
    color: 'from-green-500 to-emerald-600',
    lectures: [
      {
        id: 'cl-1',
        title: 'Elements of a Valid Contract',
        duration: '35 min',
        description: 'Offer, acceptance, consideration, and legal capacity',
        difficulty: 'beginner',
        views: 1350,
        rating: 4.9
      },
      {
        id: 'cl-2',
        title: 'Types of Contracts',
        duration: '32 min',
        description: 'Express, implied, bilateral, and unilateral contracts',
        difficulty: 'intermediate',
        views: 950,
        rating: 4.7
      },
      {
        id: 'cl-3',
        title: 'Breach of Contract and Remedies',
        duration: '38 min',
        description: 'Types of breach and available legal remedies',
        difficulty: 'intermediate',
        views: 780,
        rating: 4.8
      }
    ]
  },
  {
    id: 'family-law',
    title: 'Family Law',
    description: 'Marriage, divorce, custody, and inheritance laws in India',
    category: 'Personal Law',
    totalLectures: 9,
    totalDuration: '4h 45m',
    difficulty: 'intermediate',
    color: 'from-purple-500 to-violet-600',
    lectures: [
      {
        id: 'fl-1',
        title: 'Hindu Marriage Act, 1955',
        duration: '40 min',
        description: 'Conditions for valid marriage and grounds for divorce',
        difficulty: 'intermediate',
        views: 1100,
        rating: 4.6
      },
      {
        id: 'fl-2',
        title: 'Child Custody Laws',
        duration: '35 min',
        description: 'Best interests of child and custody arrangements',
        difficulty: 'intermediate',
        views: 850,
        rating: 4.8
      }
    ]
  },
  {
    id: 'corporate-law',
    title: 'Corporate Law',
    description: 'Company formation, governance, and compliance requirements',
    category: 'Commercial Law',
    totalLectures: 15,
    totalDuration: '8h 10m',
    difficulty: 'advanced',
    color: 'from-amber-500 to-orange-600',
    lectures: [
      {
        id: 'corp-1',
        title: 'Companies Act 2013 - Overview',
        duration: '45 min',
        description: 'Key provisions and changes from previous act',
        difficulty: 'intermediate',
        views: 920,
        rating: 4.7
      },
      {
        id: 'corp-2',
        title: 'Board of Directors - Powers and Duties',
        duration: '38 min',
        description: 'Director responsibilities and corporate governance',
        difficulty: 'advanced',
        views: 650,
        rating: 4.9
      }
    ]
  },
  {
    id: 'cyber-law',
    title: 'Cyber Law',
    description: 'IT Act, digital crimes, and online legal issues',
    category: 'Technology Law',
    totalLectures: 7,
    totalDuration: '3h 25m',
    difficulty: 'intermediate',
    color: 'from-cyan-500 to-blue-600',
    lectures: [
      {
        id: 'cy-1',
        title: 'Information Technology Act, 2000',
        duration: '30 min',
        description: 'Digital signatures, cyber crimes, and penalties',
        difficulty: 'intermediate',
        views: 750,
        rating: 4.5
      },
      {
        id: 'cy-2',
        title: 'Data Protection and Privacy',
        duration: '35 min',
        description: 'Personal data protection and privacy rights',
        difficulty: 'intermediate',
        views: 680,
        rating: 4.7
      }
    ]
  }
];

const categories = ['All', 'Constitutional Law', 'Criminal Law', 'Civil Law', 'Personal Law', 'Commercial Law', 'Technology Law'];

export default function LecturesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const filteredTopics = lectureTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  return (
    <div className="min-h-screen bg-white">
      <SharedNavigation 
        platform="apnawaqeel"
        breadcrumbs={[
          { label: 'Legal Education', href: '/legal' },
          { label: 'Lectures' }
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-100 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="w-12 h-12 text-amber-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-black">
              Legal Lectures
            </h1>
          </div>
          <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto">
            Comprehensive video lectures on Indian law and legal principles
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn from expert legal educators through structured courses covering 
            constitutional law, criminal law, civil law, and specialized topics.
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
                placeholder="Search lecture topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-black border-gray-300 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="font-medium">{category}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lecture Topics */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {filteredTopics.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No lectures found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Topic Header */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => toggleTopic(topic.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${topic.color} flex items-center justify-center`}>
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-black">{topic.title}</h3>
                            <p className="text-sm text-gray-600">{topic.category}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{topic.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Play className="w-4 h-4" />
                            <span>{topic.totalLectures} lectures</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{topic.totalDuration}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                            {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        {expandedTopic === topic.id ? (
                          <ChevronDown className="w-6 h-6 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Lecture List */}
                  {expandedTopic === topic.id && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      <div className="p-6">
                        <h4 className="text-lg font-semibold text-black mb-4">Lecture Playlist</h4>
                        <div className="space-y-3">
                          {topic.lectures.map((lecture, index) => (
                            <Link
                              key={lecture.id}
                              href={`/legal/lectures/${topic.id}/${lecture.id}`}
                              className="block"
                            >
                              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-amber-300 transition-all duration-200 group">
                                <div className="flex items-center gap-4">
                                  <div className="flex-shrink-0 w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-sm font-medium">
                                    {index + 1}
                                  </div>
                                  
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-black group-hover:text-amber-600 transition-colors">
                                      {lecture.title}
                                    </h5>
                                    <p className="text-sm text-gray-600 mt-1">{lecture.description}</p>
                                    
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{lecture.duration}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        <span>{lecture.views.toLocaleString()} views</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current text-yellow-400" />
                                        <span>{lecture.rating}</span>
                                      </div>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lecture.difficulty)}`}>
                                        {lecture.difficulty}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center group-hover:bg-amber-700 transition-colors">
                                      <Play className="w-4 h-4 ml-0.5" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-6 text-amber-100" />
          <h2 className="text-3xl font-bold mb-4">
            Start Your Legal Education Journey
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Access comprehensive legal education content designed by experts 
            to help you understand Indian law and legal principles.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/legal">
              <Button 
                size="lg"
                className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-3 font-semibold"
              >
                Explore More Features
              </Button>
            </Link>
            <Link href="/courtroom-battle">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-amber-600 px-8 py-3 font-semibold"
              >
                Practice in Courtroom
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}