"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Scale, BookOpen, ArrowRight, Sparkles, Users, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

const platforms = [
  {
    id: 'apnawaqeel',
    title: 'apnaWaqeel',
    subtitle: 'Legal Education Platform',
    description: 'Master legal concepts through interactive AI-powered lessons and courtroom simulations. Learn law with Gandhi as your guide.',
    icon: Scale,
    href: '/legal',
    color: 'from-amber-500 to-orange-500',
    features: ['AI Legal Advisor', 'Courtroom Battles', 'Interactive Learning'],
    status: 'available'
  },
  {
    id: 'apnihistory',
    title: 'apniHistory',
    subtitle: 'History Education Platform',
    description: 'Explore historical events through immersive storytelling and interactive timelines. Journey through time with engaging narratives.',
    icon: BookOpen,
    href: '/apni-history',
    color: 'from-blue-500 to-indigo-500',
    features: ['Interactive Timelines', 'Historical Simulations', 'Cultural Insights'],
    status: 'coming-soon'
  }
];

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-orange-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              EduVerse
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto">
            Revolutionizing Education Through AI-Powered Interactive Learning
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive educational platforms designed to make learning engaging, 
            accessible, and effective for everyone.
          </p>
          
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-amber-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-amber-600" />
                <span className="text-2xl font-bold text-gray-800">10K+</span>
              </div>
              <p className="text-sm text-gray-600">Active Learners</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-amber-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <span className="text-2xl font-bold text-gray-800">500+</span>
              </div>
              <p className="text-sm text-gray-600">Interactive Lessons</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-amber-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                <span className="text-2xl font-bold text-gray-800">95%</span>
              </div>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </header>

      {/* Platforms Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Choose Your Learning Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select from our specialized educational platforms, each designed with cutting-edge AI 
            to provide personalized and engaging learning experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const isHovered = hoveredCard === platform.id;
            const isAvailable = platform.status === 'available';
            
            return (
              <div
                key={platform.id}
                className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
                  isHovered 
                    ? 'border-amber-300 shadow-2xl scale-105' 
                    : 'border-gray-200 shadow-lg hover:shadow-xl'
                } ${!isAvailable ? 'opacity-75' : ''}`}
                onMouseEnter={() => setHoveredCard(platform.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-5 transition-opacity duration-500 ${
                  isHovered ? 'opacity-10' : ''
                }`}></div>
                
                {/* Content */}
                <div className="relative bg-white/90 backdrop-blur-sm p-8 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-r ${platform.color} transition-transform duration-300 ${
                        isHovered ? 'scale-110 rotate-3' : ''
                      }`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{platform.title}</h3>
                        <p className="text-sm text-gray-600">{platform.subtitle}</p>
                      </div>
                    </div>
                    
                    {!isAvailable && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
                    {platform.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Key Features:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {platform.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    {isAvailable ? (
                      <Link href={platform.href}>
                        <Button 
                          className={`w-full bg-gradient-to-r ${platform.color} hover:shadow-lg transition-all duration-300 text-white font-semibold py-3 ${
                            isHovered ? 'scale-105' : ''
                          }`}
                        >
                          <span>Explore {platform.title}</span>
                          <ArrowRight className={`w-5 h-5 ml-2 transition-transform duration-300 ${
                            isHovered ? 'translate-x-1' : ''
                          }`} />
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        disabled
                        className="w-full bg-gray-300 text-gray-500 cursor-not-allowed py-3"
                      >
                        <span>Coming Soon</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${platform.color} opacity-0 transition-opacity duration-500 ${
                  isHovered ? 'opacity-5' : ''
                } pointer-events-none`}></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/50 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose EduVerse?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platforms are built with cutting-edge technology to provide the best learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">AI-Powered Learning</h3>
              <p className="text-gray-600">
                Personalized learning experiences powered by advanced AI that adapts to your pace and style.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Interactive Experience</h3>
              <p className="text-gray-600">
                Engage with content through simulations, games, and interactive exercises that make learning fun.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Proven Results</h3>
              <p className="text-gray-600">
                Track your progress with detailed analytics and achieve your learning goals faster than ever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <h3 className="text-2xl font-bold">EduVerse</h3>
          </div>
          <p className="text-gray-400 mb-6">
            Transforming education through innovative AI-powered learning platforms.
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <span>© 2024 EduVerse. All rights reserved.</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}