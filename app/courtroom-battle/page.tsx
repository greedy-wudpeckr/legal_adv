"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Scale, Gavel, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const caseCategories = [
  { id: 'murder', name: 'Murder', description: 'Homicide and related charges', color: 'bg-red-100 border-red-300 text-red-800' },
  { id: 'theft', name: 'Theft', description: 'Property crimes and burglary', color: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: 'fraud', name: 'Fraud', description: 'Financial crimes and deception', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
  { id: 'assault', name: 'Assault', description: 'Physical violence and battery', color: 'bg-purple-100 border-purple-300 text-purple-800' },
];

export default function CourtroomBattle() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center gap-3">
              <Scale className="w-8 h-8 text-amber-600" />
              <h1 className="text-2xl font-bold text-gray-800">ApnaWakeel.ai</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gavel className="w-12 h-12 text-amber-600" />
            <h1 className="text-4xl font-bold text-gray-800">Courtroom Battle</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test Your Legal Skills - Challenge yourself with real-world legal scenarios and build your expertise
          </p>
        </div>

        {/* Start New Case Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-amber-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Ready for a Challenge?</h2>
            <p className="text-gray-600">Choose a case category and put your legal knowledge to the test</p>
          </div>
          
          <div className="flex justify-center">
            <Button 
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Gavel className="w-5 h-5 mr-2" />
              Start New Case
            </Button>
          </div>
        </div>

        {/* Case Categories */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-amber-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Case Categories</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {caseCategories.map((category) => (
              <div
                key={category.id}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedCategory === category.id 
                    ? `${category.color} shadow-md scale-105` 
                    : 'bg-gray-50 border-gray-200 hover:border-amber-300'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xl font-semibold">{category.name}</h4>
                  <Scale className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-sm opacity-80">{category.description}</p>
                
                {selectedCategory === category.id && (
                  <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                    <Button 
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      Start {category.name} Case
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="mt-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-6 border border-amber-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Coming Soon</h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span>Interactive Case Simulations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span>AI Judge & Jury</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span>Skill Progress Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}