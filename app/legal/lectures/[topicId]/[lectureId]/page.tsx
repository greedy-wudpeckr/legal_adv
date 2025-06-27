"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  Download,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SharedNavigation from '@/components/shared-navigation';

interface LectureContent {
  id: string;
  title: string;
  topicId: string;
  topicTitle: string;
  duration: string;
  views: number;
  rating: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructor: string;
  content: {
    introduction: string;
    sections: {
      title: string;
      content: string;
      keyPoints?: string[];
      examples?: string[];
    }[];
    conclusion: string;
    references?: string[];
  };
  nextLecture?: {
    id: string;
    title: string;
  };
  previousLecture?: {
    id: string;
    title: string;
  };
}

// Mock lecture content data
const lectureContentData: Record<string, LectureContent> = {
  'fr-1': {
    id: 'fr-1',
    title: 'Introduction to Fundamental Rights',
    topicId: 'fundamental-rights',
    topicTitle: 'Fundamental Rights',
    duration: '35 min',
    views: 1250,
    rating: 4.8,
    difficulty: 'beginner',
    instructor: 'Dr. Priya Sharma',
    content: {
      introduction: 'Fundamental Rights are the basic human rights enshrined in the Constitution of India which guarantee civil liberties to all citizens. These rights are essential for the development of the personality of every individual and to preserve human dignity.',
      sections: [
        {
          title: 'What are Fundamental Rights?',
          content: 'Fundamental Rights are basic human rights that are guaranteed by the Constitution to all citizens of India. They are called "fundamental" because they are most essential for the development of human personality and are given the highest priority in the Constitution.',
          keyPoints: [
            'Guaranteed by the Constitution of India',
            'Available to all citizens regardless of race, religion, gender, or caste',
            'Essential for human dignity and personality development',
            'Enforceable by courts of law',
            'Form the foundation of democracy'
          ]
        },
        {
          title: 'Historical Background',
          content: 'The concept of Fundamental Rights in India was inspired by the Bill of Rights in the US Constitution and the Universal Declaration of Human Rights. The Constituent Assembly, led by Dr. B.R. Ambedkar, incorporated these rights to ensure justice, liberty, and equality for all citizens.',
          keyPoints: [
            'Inspired by US Bill of Rights',
            'Influenced by Universal Declaration of Human Rights',
            'Drafted by the Constituent Assembly (1946-1950)',
            'Dr. B.R. Ambedkar played a crucial role',
            'Came into effect on January 26, 1950'
          ]
        },
        {
          title: 'Categories of Fundamental Rights',
          content: 'The Indian Constitution originally provided for seven Fundamental Rights, but currently there are six categories after the Right to Property was removed from the list of Fundamental Rights by the 44th Amendment in 1978.',
          keyPoints: [
            'Right to Equality (Articles 14-18)',
            'Right to Freedom (Articles 19-22)',
            'Right against Exploitation (Articles 23-24)',
            'Right to Freedom of Religion (Articles 25-28)',
            'Cultural and Educational Rights (Articles 29-30)',
            'Right to Constitutional Remedies (Article 32)'
          ],
          examples: [
            'Right to Equality ensures equal treatment before law',
            'Right to Freedom includes freedom of speech and expression',
            'Right against Exploitation prohibits forced labor',
            'Right to Constitutional Remedies allows direct approach to Supreme Court'
          ]
        },
        {
          title: 'Importance and Significance',
          content: 'Fundamental Rights serve as the cornerstone of Indian democracy. They protect individual liberty, promote social justice, and ensure that the government cannot abuse its power. These rights are justiciable, meaning citizens can approach courts if these rights are violated.',
          keyPoints: [
            'Protect individual liberty and dignity',
            'Ensure limited government and prevent abuse of power',
            'Promote social justice and equality',
            'Provide legal remedies through courts',
            'Form the basic structure of the Constitution'
          ]
        }
      ],
      conclusion: 'Fundamental Rights are not just legal provisions but represent the values and aspirations of Indian society. They ensure that every citizen can live with dignity and participate meaningfully in democratic processes. Understanding these rights is essential for every citizen to protect their interests and contribute to nation-building.',
      references: [
        'Constitution of India - Part III (Articles 12-35)',
        'Kesavananda Bharati v. State of Kerala (1973)',
        'Maneka Gandhi v. Union of India (1978)',
        'Universal Declaration of Human Rights (1948)'
      ]
    },
    nextLecture: {
      id: 'fr-2',
      title: 'Right to Equality (Articles 14-18)'
    }
  },
  'fr-2': {
    id: 'fr-2',
    title: 'Right to Equality (Articles 14-18)',
    topicId: 'fundamental-rights',
    topicTitle: 'Fundamental Rights',
    duration: '42 min',
    views: 980,
    rating: 4.7,
    difficulty: 'beginner',
    instructor: 'Dr. Priya Sharma',
    content: {
      introduction: 'The Right to Equality is the first and most important fundamental right guaranteed by the Indian Constitution. It ensures that all citizens are treated equally before the law and prohibits discrimination on various grounds.',
      sections: [
        {
          title: 'Article 14: Equality before Law',
          content: 'Article 14 states that "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India." This article embodies two concepts: equality before law and equal protection of laws.',
          keyPoints: [
            'Equality before law - negative concept (no special privileges)',
            'Equal protection of laws - positive concept (equal treatment in similar circumstances)',
            'Applies to all persons, not just citizens',
            'Prohibits class legislation',
            'Allows reasonable classification'
          ],
          examples: [
            'All persons have equal access to courts',
            'No person is above the law',
            'Government officials cannot claim immunity from law',
            'Laws must be applied equally to all'
          ]
        },
        {
          title: 'Article 15: Prohibition of Discrimination',
          content: 'Article 15 prohibits discrimination by the State against any citizen on grounds of religion, race, caste, sex, or place of birth. However, it allows the State to make special provisions for women, children, and socially disadvantaged groups.',
          keyPoints: [
            'Prohibits discrimination on five grounds',
            'Applies only to State action, not private discrimination',
            'Allows special provisions for women and children',
            'Permits affirmative action for backward classes',
            'Exception for religious and charitable institutions'
          ]
        },
        {
          title: 'Article 16: Equality of Opportunity in Public Employment',
          content: 'Article 16 guarantees equality of opportunity for all citizens in matters of public employment. It ensures that all citizens have equal access to government jobs and prohibits discrimination in public employment.',
          keyPoints: [
            'Equal opportunity in public employment',
            'No discrimination in government jobs',
            'Allows reservation for backward classes',
            'Permits residence requirements for certain posts',
            'Allows religious requirements for religious institutions'
          ]
        }
      ],
      conclusion: 'The Right to Equality forms the bedrock of Indian democracy by ensuring that all citizens are treated with equal dignity and respect. While it prohibits discrimination, it also allows for positive discrimination to uplift disadvantaged sections of society.',
      references: [
        'E.P. Royappa v. State of Tamil Nadu (1974)',
        'Indra Sawhney v. Union of India (1992)',
        'State of West Bengal v. Anwar Ali Sarkar (1952)'
      ]
    },
    previousLecture: {
      id: 'fr-1',
      title: 'Introduction to Fundamental Rights'
    },
    nextLecture: {
      id: 'fr-3',
      title: 'Right to Freedom (Articles 19-22)'
    }
  }
};

export default function LecturePage() {
  const params = useParams();
  const topicId = params.topicId as string;
  const lectureId = params.lectureId as string;
  
  const [lecture, setLecture] = useState<LectureContent | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const lectureData = lectureContentData[lectureId];
    if (lectureData) {
      setLecture(lectureData);
    }
  }, [lectureId]);

  if (!lecture) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-4">Lecture Not Found</h1>
          <p className="text-gray-600 mb-6">The requested lecture could not be found.</p>
          <Link href="/legal/lectures">
            <Button className="bg-amber-600 hover:bg-amber-700">
              Back to Lectures
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SharedNavigation 
        platform="apnawaqeel"
        breadcrumbs={[
          { label: 'Legal Education', href: '/legal' },
          { label: 'Lectures', href: '/legal/lectures' },
          { label: lecture.topicTitle, href: '/legal/lectures' },
          { label: lecture.title }
        ]}
      />

      {/* Lecture Header */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-100 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-6">
            <Link 
              href="/legal/lectures" 
              className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Lectures</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 border border-amber-200">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-black">{lecture.title}</h1>
                    <p className="text-gray-600">{lecture.topicTitle}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{lecture.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{lecture.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span>{lecture.rating}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lecture.difficulty)}`}>
                    {lecture.difficulty.charAt(0).toUpperCase() + lecture.difficulty.slice(1)}
                  </span>
                </div>
                
                <p className="text-gray-700">Instructor: <span className="font-medium">{lecture.instructor}</span></p>
              </div>
              
              <div className="flex items-center gap-2 ml-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`border-gray-300 ${isBookmarked ? 'bg-amber-50 text-amber-600' : 'text-gray-600'}`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-600">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-600">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lecture Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            
            {/* Table of Contents */}
            <div className="bg-gray-50 border-b border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Table of Contents</h3>
              <div className="space-y-2">
                {lecture.content.sections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSection(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      activeSection === index
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium">{section.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Introduction */}
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">Introduction</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed">{lecture.content.introduction}</p>
                </div>
              </div>

              {/* Active Section Content */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {activeSection + 1}
                  </span>
                  <h2 className="text-2xl font-bold text-black">{lecture.content.sections[activeSection].title}</h2>
                </div>
                
                <div className="prose prose-lg max-w-none mb-6">
                  <p className="text-gray-700 leading-relaxed">{lecture.content.sections[activeSection].content}</p>
                </div>

                {/* Key Points */}
                {lecture.content.sections[activeSection].keyPoints && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-black mb-3">Key Points:</h4>
                    <ul className="space-y-2">
                      {lecture.content.sections[activeSection].keyPoints!.map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Examples */}
                {lecture.content.sections[activeSection].examples && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-black mb-3">Examples:</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <ul className="space-y-2">
                        {lecture.content.sections[activeSection].examples!.map((example, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-blue-800">{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Section Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                    disabled={activeSection === 0}
                    className="border-gray-300"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous Section
                  </Button>
                  
                  <span className="text-sm text-gray-600">
                    Section {activeSection + 1} of {lecture.content.sections.length}
                  </span>
                  
                  <Button
                    variant="outline"
                    onClick={() => setActiveSection(Math.min(lecture.content.sections.length - 1, activeSection + 1))}
                    disabled={activeSection === lecture.content.sections.length - 1}
                    className="border-gray-300"
                  >
                    Next Section
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Conclusion */}
              {activeSection === lecture.content.sections.length - 1 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-black mb-4">Conclusion</h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed">{lecture.content.conclusion}</p>
                  </div>
                </div>
              )}

              {/* References */}
              {lecture.content.references && activeSection === lecture.content.sections.length - 1 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-black mb-3">References:</h3>
                  <ul className="space-y-2">
                    {lecture.content.references.map((reference, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">{reference}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation to Next/Previous Lectures */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {lecture.previousLecture ? (
              <Link href={`/legal/lectures/${topicId}/${lecture.previousLecture.id}`}>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {lecture.previousLecture.title}
                </Button>
              </Link>
            ) : (
              <div></div>
            )}
            
            {lecture.nextLecture ? (
              <Link href={`/legal/lectures/${topicId}/${lecture.nextLecture.id}`}>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  {lecture.nextLecture.title}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link href="/legal/lectures">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  Back to Lectures
                  <BookOpen className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}