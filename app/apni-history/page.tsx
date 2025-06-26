"use client"

import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Users, Star, Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ApniHistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to EduVerse</span>
            </Link>
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">apniHistory</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="mb-8">
          <Construction className="w-24 h-24 text-blue-500 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Coming Soon!
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            apniHistory is currently under development. We're creating an immersive historical learning experience 
            that will revolutionize how you explore and understand history.
          </p>
        </div>

        {/* Features Preview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-blue-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">What to Expect</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Interactive Timelines</h3>
              <p className="text-sm text-gray-600">
                Explore historical events through dynamic, interactive timelines that bring history to life.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Historical Simulations</h3>
              <p className="text-sm text-gray-600">
                Step into the shoes of historical figures and experience pivotal moments in history.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Cultural Insights</h3>
              <p className="text-sm text-gray-600">
                Discover the rich cultural heritage and traditions that shaped civilizations.
              </p>
            </div>
          </div>
        </div>

        {/* Notification Signup */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-semibold mb-4">Be the First to Know</h3>
          <p className="mb-6">
            Get notified when apniHistory launches and be among the first to experience 
            revolutionary historical education.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 font-semibold">
              Notify Me
            </Button>
          </div>
        </div>

        {/* Back to Legal Platform */}
        <div className="mt-12">
          <p className="text-gray-600 mb-4">
            In the meantime, explore our legal education platform:
          </p>
          <Link href="/legal">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 font-semibold">
              Try apnaWaqeel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}