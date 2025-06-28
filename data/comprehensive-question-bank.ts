import { QuizQuestion } from '@/types/quiz';

export const comprehensiveQuestionBank: Record<string, QuizQuestion[]> = {
  'constitutional-law': [
    {
      id: 'cl1',
      type: 'text',
      question: 'Who is known as the "Father of the Indian Constitution"?',
      options: ['Mahatma Gandhi', 'Dr. B.R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Patel'],
      correctAnswer: 1,
      explanation: 'Dr. B.R. Ambedkar is known as the Father of the Indian Constitution for his pivotal role as the Chairman of the Drafting Committee.',
      difficulty: 'beginner',
      category: 'constitutional-law',
      points: 10
    },
    {
      id: 'cl2',
      type: 'text',
      question: 'Which Article of the Indian Constitution deals with the Right to Equality?',
      options: ['Article 12', 'Article 14', 'Article 19', 'Article 21'],
      correctAnswer: 1,
      explanation: 'Article 14 guarantees equality before law and equal protection of laws to all persons within the territory of India.',
      difficulty: 'intermediate',
      category: 'constitutional-law',
      points: 15
    },
    {
      id: 'cl3',
      type: 'scenario',
      question: 'The Doctrine of Basic Structure was established in which landmark case?',
      options: ['Golaknath Case', 'Kesavananda Bharati Case', 'Minerva Mills Case', 'Maneka Gandhi Case'],
      correctAnswer: 1,
      explanation: 'The Kesavananda Bharati v. State of Kerala (1973) case established the Doctrine of Basic Structure, limiting Parliament\'s power to amend the Constitution.',
      difficulty: 'expert',
      category: 'constitutional-law',
      points: 25
    },
    {
      id: 'cl4',
      type: 'text',
      question: 'Which Article is known as the "Heart and Soul" of the Constitution?',
      options: ['Article 21', 'Article 32', 'Article 356', 'Article 370'],
      correctAnswer: 1,
      explanation: 'Article 32, the Right to Constitutional Remedies, is called the "Heart and Soul" of the Constitution by Dr. Ambedkar.',
      difficulty: 'intermediate',
      category: 'constitutional-law',
      points: 15
    },
    {
      id: 'cl5',
      type: 'scenario',
      question: 'The concept of "Procedure Established by Law" vs "Due Process of Law" was clarified in which case?',
      options: ['A.K. Gopalan Case', 'Maneka Gandhi Case', 'Minerva Mills Case', 'Shankari Prasad Case'],
      correctAnswer: 1,
      explanation: 'Maneka Gandhi v. Union of India (1978) expanded the interpretation of Article 21 to include due process, not just procedure established by law.',
      difficulty: 'expert',
      category: 'constitutional-law',
      points: 25
    }
  ],
  'freedom-struggle': [
    {
      id: 'fs1',
      type: 'text',
      question: 'The Quit India Movement was launched in which year?',
      options: ['1940', '1942', '1944', '1946'],
      correctAnswer: 1,
      explanation: 'The Quit India Movement was launched on August 8, 1942, by Mahatma Gandhi, demanding an end to British rule in India.',
      difficulty: 'beginner',
      category: 'freedom-struggle',
      points: 10
    },
    {
      id: 'fs2',
      type: 'scenario',
      question: 'Who gave the famous slogan "Give me blood, and I will give you freedom"?',
      options: ['Mahatma Gandhi', 'Subhas Chandra Bose', 'Bhagat Singh', 'Chandrashekhar Azad'],
      correctAnswer: 1,
      explanation: 'Subhas Chandra Bose gave this famous slogan while leading the Indian National Army (Azad Hind Fauj) during World War II.',
      difficulty: 'intermediate',
      category: 'freedom-struggle',
      points: 15
    },
    {
      id: 'fs3',
      type: 'text',
      question: 'The Indian National Congress was founded in which year?',
      options: ['1883', '1885', '1887', '1889'],
      correctAnswer: 1,
      explanation: 'The Indian National Congress was founded in 1885 by Allan Octavian Hume, becoming the principal leader of the Indian independence movement.',
      difficulty: 'beginner',
      category: 'freedom-struggle',
      points: 10
    },
    {
      id: 'fs4',
      type: 'scenario',
      question: 'The Jallianwala Bagh massacre took place in which city?',
      options: ['Delhi', 'Amritsar', 'Lahore', 'Lucknow'],
      correctAnswer: 1,
      explanation: 'The Jallianwala Bagh massacre occurred in Amritsar on April 13, 1919, when British troops fired on a peaceful gathering.',
      difficulty: 'intermediate',
      category: 'freedom-struggle',
      points: 15
    },
    {
      id: 'fs5',
      type: 'text',
      question: 'Who founded the Azad Hind Fauj (Indian National Army)?',
      options: ['Subhas Chandra Bose', 'Ras Bihari Bose', 'Mohan Singh', 'Shah Nawaz Khan'],
      correctAnswer: 0,
      explanation: 'Subhas Chandra Bose reorganized and led the Azad Hind Fauj (Indian National Army) to fight for Indian independence.',
      difficulty: 'intermediate',
      category: 'freedom-struggle',
      points: 15
    }
  ],
  'legal-reforms': [
    {
      id: 'lr1',
      type: 'text',
      question: 'The Hindu Marriage Act was passed in which year?',
      options: ['1954', '1955', '1956', '1957'],
      correctAnswer: 1,
      explanation: 'The Hindu Marriage Act, 1955, was a significant legal reform that codified Hindu marriage laws and provided for divorce.',
      difficulty: 'intermediate',
      category: 'legal-reforms',
      points: 15
    },
    {
      id: 'lr2',
      type: 'scenario',
      question: 'Which Act abolished the practice of Sati?',
      options: ['Sati Prevention Act, 1829', 'Bengal Sati Regulation, 1829', 'Hindu Widows Remarriage Act, 1856', 'Age of Consent Act, 1891'],
      correctAnswer: 1,
      explanation: 'The Bengal Sati Regulation, 1829, passed by Lord William Bentinck, abolished the practice of Sati in Bengal.',
      difficulty: 'expert',
      category: 'legal-reforms',
      points: 25
    },
    {
      id: 'lr3',
      type: 'text',
      question: 'The Right to Information Act was passed in which year?',
      options: ['2003', '2005', '2007', '2009'],
      correctAnswer: 1,
      explanation: 'The Right to Information Act, 2005, was passed to promote transparency and accountability in government functioning.',
      difficulty: 'beginner',
      category: 'legal-reforms',
      points: 10
    },
    {
      id: 'lr4',
      type: 'scenario',
      question: 'The Triple Talaq was declared unconstitutional by the Supreme Court in which year?',
      options: ['2015', '2017', '2018', '2019'],
      correctAnswer: 1,
      explanation: 'In 2017, the Supreme Court declared the practice of Triple Talaq (instant divorce) unconstitutional in the Shayara Bano case.',
      difficulty: 'intermediate',
      category: 'legal-reforms',
      points: 15
    }
  ],
  'famous-cases': [
    {
      id: 'fc1',
      type: 'scenario',
      question: 'In the Kesavananda Bharati case, the Supreme Court established which important doctrine?',
      options: ['Judicial Review', 'Basic Structure', 'Separation of Powers', 'Rule of Law'],
      correctAnswer: 1,
      explanation: 'The Kesavananda Bharati case (1973) established the Basic Structure doctrine, limiting Parliament\'s power to amend the Constitution.',
      difficulty: 'expert',
      category: 'famous-cases',
      points: 25
    },
    {
      id: 'fc2',
      type: 'text',
      question: 'The Maneka Gandhi case expanded the interpretation of which Article?',
      options: ['Article 14', 'Article 19', 'Article 21', 'Article 32'],
      correctAnswer: 2,
      explanation: 'Maneka Gandhi v. Union of India (1978) expanded Article 21 to include the right to live with dignity and due process.',
      difficulty: 'expert',
      category: 'famous-cases',
      points: 25
    },
    {
      id: 'fc3',
      type: 'scenario',
      question: 'The Vishaka Guidelines were established in response to which issue?',
      options: ['Environmental Protection', 'Sexual Harassment at Workplace', 'Child Rights', 'Women\'s Reservation'],
      correctAnswer: 1,
      explanation: 'The Vishaka v. State of Rajasthan (1997) case established guidelines for preventing sexual harassment at the workplace.',
      difficulty: 'intermediate',
      category: 'famous-cases',
      points: 15
    },
    {
      id: 'fc4',
      type: 'text',
      question: 'The Minerva Mills case dealt with which constitutional amendment?',
      options: ['24th Amendment', '25th Amendment', '42nd Amendment', '44th Amendment'],
      correctAnswer: 2,
      explanation: 'The Minerva Mills case (1980) struck down certain provisions of the 42nd Amendment, reinforcing the Basic Structure doctrine.',
      difficulty: 'expert',
      category: 'famous-cases',
      points: 25
    }
  ]
};

export const getQuestionsByCategory = (category: string, difficulty?: string, count: number = 10): QuizQuestion[] => {
  const categoryQuestions = comprehensiveQuestionBank[category] || [];
  
  let filteredQuestions = categoryQuestions;
  if (difficulty) {
    filteredQuestions = categoryQuestions.filter(q => q.difficulty === difficulty);
  }
  
  // Shuffle and return requested count
  const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getAllQuestions = (): QuizQuestion[] => {
  return Object.values(comprehensiveQuestionBank).flat();
};

export const getRandomQuestions = (count: number = 10): QuizQuestion[] => {
  const allQuestions = getAllQuestions();
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};