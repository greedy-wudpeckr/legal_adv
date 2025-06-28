import { HistoricalPeriod, HistoricalFigure, HistoricalEvent, HistoricalDocument } from '@/types/history';

export const historicalPeriods: HistoricalPeriod[] = [
  {
    id: 'ancient-india',
    name: 'Ancient India',
    timeRange: '3000 BCE - 600 CE',
    description: 'The foundation of Indian civilization, from the Indus Valley to the Gupta Empire. This era saw the birth of major religions, philosophical schools, and the establishment of classical Indian culture.',
    color: 'from-amber-500 to-orange-500',
    keyEvents: [
      'Indus Valley Civilization (3300-1300 BCE)',
      'Vedic Period (1500-500 BCE)',
      'Mauryan Empire (322-185 BCE)',
      'Gupta Golden Age (320-550 CE)'
    ],
    culturalHighlights: [
      'Development of Sanskrit literature',
      'Birth of Buddhism and Jainism',
      'Classical Indian art and architecture',
      'Mathematical and astronomical advances'
    ]
  },
  {
    id: 'medieval-india',
    name: 'Medieval India',
    timeRange: '600 - 1700 CE',
    description: 'A period of cultural synthesis and political transformation, marked by the rise of regional kingdoms, Islamic invasions, and the flourishing of Indo-Islamic culture.',
    color: 'from-emerald-500 to-teal-500',
    keyEvents: [
      'Delhi Sultanate (1206-1526)',
      'Mughal Empire (1526-1857)',
      'Vijayanagara Empire (1336-1646)',
      'Maratha Confederacy (1674-1818)'
    ],
    culturalHighlights: [
      'Indo-Islamic architecture',
      'Bhakti and Sufi movements',
      'Classical Indian music development',
      'Persian influence on literature'
    ]
  },
  {
    id: 'modern-india',
    name: 'Modern India',
    timeRange: '1700 - 1947',
    description: 'The colonial period and struggle for independence, characterized by British rule, social reform movements, and the eventual birth of independent India.',
    color: 'from-blue-500 to-indigo-500',
    keyEvents: [
      'British East India Company rule',
      'Indian Rebellion of 1857',
      'Indian National Congress formation (1885)',
      'Independence Movement (1920s-1947)'
    ],
    culturalHighlights: [
      'Bengal Renaissance',
      'Social reform movements',
      'Modern Indian literature',
      'Freedom struggle culture'
    ]
  }
];

export const historicalFigures: HistoricalFigure[] = [
  {
    id: 'ashoka',
    name: 'Emperor Ashoka',
    period: 'ancient-india',
    timeRange: '304 - 232 BCE',
    biography:
      'Ashoka the Great was an Indian emperor of the Maurya Dynasty who ruled almost all of the Indian subcontinent. After witnessing the devastation of the Kalinga War, he embraced Buddhism and became known for his policy of non-violence and moral governance.',
    achievements: [
      'Unified most of the Indian subcontinent under one rule',
      'Promoted Buddhism and built thousands of stupas',
      'Established a network of hospitals and veterinary clinics',
      'Created the first known animal welfare laws',
      'Spread Buddhism to Sri Lanka, Central Asia, and Southeast Asia'
    ],
    significance:
      'Transformed from a ruthless conqueror to a benevolent ruler, establishing principles of governance based on dharma (righteousness) that influenced Indian political thought for centuries.',
    quotes: [
      'All men are my children. What I desire for my own children, and I desire their welfare and happiness both in this world and the next, that I desire for all men.',
      'There is no better work than promoting the welfare of all the people and whatever efforts I am making is to repay the debt I owe to all people.'
    ],
    avatarModel: 'ashoka_3d_model.glb',
    voiceId: 'ashoka_voice_id',
    imageUrl: '/images/ashoka.jpg'
  },
  {
    id: 'gandhi',
    name: 'Mahatma Gandhi',
    period: 'modern-india',
    timeRange: '1869 - 1948',
    biography:
      'Mohandas Karamchand Gandhi, known as Mahatma Gandhi, was the leader of India\'s nonviolent independence movement against British rule. He pioneered the philosophy of satyagraha—nonviolent resistance to tyranny.',
    achievements: [
      'Led India\'s struggle for independence through nonviolent means',
      'Organized the Salt March and Quit India Movement',
      'Inspired civil rights movements worldwide',
      'Promoted principles of truth, nonviolence, and self-reliance',
      'Influenced the drafting of the Indian Constitution'
    ],
    significance:
      'Symbolized peace, civil disobedience, and moral leadership, and became an enduring global icon for nonviolent resistance.',
    quotes: [
      'Be the change you wish to see in the world.',
      'The best way to find yourself is to lose yourself in the service of others.',
      'An eye for an eye will make the whole world blind.'
    ],
    avatarModel: 'gandhi_3d_model.glb',
    voiceId: 'gandhi_voice_id',
    imageUrl: '/images/gandhi.jpg'
  },
  {
    id: 'subash',
    name: 'Subhas Chandra Bose',
    period: 'modern-india',
    timeRange: '1897 - 1945',
    biography:
      'Subhas Chandra Bose was an Indian nationalist whose defiance of British authority made him a hero among Indians. He formed the Indian National Army (Azad Hind Fauj) and sought international support for Indian independence.',
    achievements: [
      'Founded the Indian National Army (INA)',
      'Established the Provisional Government of Free India',
      'Mobilized international support for Indian independence',
      'Inspired millions with his slogan "Give me blood, and I will give you freedom"',
      'Challenged British authority through armed resistance'
    ],
    significance:
      'Represented the revolutionary approach to Indian independence and demonstrated that armed resistance could be an effective tool against colonial rule, inspiring future generations of freedom fighters.',
    quotes: [
      'Give me blood, and I will give you freedom!',
      'It is our duty to pay for our liberty with our own blood.',
      'No real change in history has ever been achieved by discussions.'
    ],
    avatarModel: 'bose_3d_model.glb',
    voiceId: 'bose_voice_id',
    imageUrl: '/images/subhas-bose.jpg'
  },
  {
    id: 'vallabh',
    name: 'Sardar Vallabhbhai Patel',
    period: 'modern-india',
    timeRange: '1875 - 1950',
    biography:
      'Sardar Vallabhbhai Patel, known as the Iron Man of India, was instrumental in the political integration of India. As the first Deputy Prime Minister and Home Minister, he unified over 500 princely states into the Indian Union.',
    achievements: [
      'Unified India by integrating princely states post-independence',
      'Played a crucial role in the Quit India Movement',
      'Was a senior leader in the Indian National Congress',
      'Oversaw India\'s transition to independence and democratic governance',
      'Advocated strong central authority for national unity'
    ],
    significance:
      'Played a foundational role in shaping post-independence India, ensuring its unity and stability through statesmanship, negotiation, and determination.',
    quotes: [
      'Manpower without unity is not a strength unless it is harmonized and united properly, then it becomes a spiritual power.',
      'Every citizen of India must remember that he is an Indian and he has every right in this country but with certain duties.',
      'Take to the path of dharma – the path of truth and justice. Don’t misuse your freedom.'
    ],
    avatarModel: 'patel_3d_model.glb',
    voiceId: 'patel_voice_id',
    imageUrl: '/images/vallabhbhai-patel.jpg'
  }
];

export const historicalEvents: HistoricalEvent[] = [
  {
    id: 'kalinga-war',
    date: '261 BCE',
    title: 'The Kalinga War',
    description: 'A devastating war fought between the Mauryan Empire under Ashoka and the kingdom of Kalinga (modern-day Odisha). The war resulted in massive casualties and ultimately led to Ashoka\'s conversion to Buddhism.',
    significance: 'Marked a turning point in Ashoka\'s reign and Indian history, leading to the promotion of non-violence and Buddhist principles across the empire.',
    period: 'ancient-india',
    location: 'Kalinga (modern-day Odisha)',
    keyFigures: ['ashoka'],
    consequences: [
      'Ashoka\'s conversion to Buddhism',
      'Promotion of non-violence (ahimsa)',
      'Spread of Buddhism across Asia',
      'Establishment of welfare state principles'
    ]
  },
  {
    id: 'battle-of-panipat-1526',
    date: '1526 CE',
    title: 'First Battle of Panipat',
    description: 'The battle that established Mughal rule in India, fought between Babur and Ibrahim Lodi. Babur\'s victory marked the beginning of the Mughal Empire in India.',
    significance: 'Established Mughal dynasty in India, which would rule for over 300 years and profoundly influence Indian culture, architecture, and administration.',
    period: 'medieval-india',
    location: 'Panipat, Haryana',
    keyFigures: ['babur', 'ibrahim-lodi'],
    consequences: [
      'End of Delhi Sultanate',
      'Beginning of Mughal Empire',
      'Introduction of new military tactics',
      'Cultural synthesis of Central Asian and Indian traditions'
    ]
  },
  {
    id: 'revolt-of-1857',
    date: '1857 CE',
    title: 'Indian Rebellion of 1857',
    description: 'A major uprising against British rule in India, also known as the First War of Independence. It began as a mutiny of sepoys but spread across northern and central India.',
    significance: 'Marked the beginning of organized resistance against British rule and led to the end of East India Company rule, with the British Crown taking direct control of India.',
    period: 'modern-india',
    location: 'Northern and Central India',
    keyFigures: ['rani-lakshmibai', 'mangal-pandey', 'bahadur-shah-zafar'],
    consequences: [
      'End of East India Company rule',
      'Beginning of British Crown rule',
      'Increased awareness of Indian nationalism',
      'Reforms in British administrative policies'
    ]
  },
  {
    id: 'quit-india-movement',
    date: '1942 CE',
    title: 'Quit India Movement',
    description: 'A civil disobedience movement launched by Mahatma Gandhi demanding an end to British rule in India. The movement saw widespread participation across the country.',
    significance: 'Demonstrated the mass appeal of the independence movement and put immense pressure on British authorities, accelerating the process toward independence.',
    period: 'modern-india',
    location: 'All India',
    keyFigures: ['mahatma-gandhi', 'subhas-chandra-bose'],
    consequences: [
      'Mass arrests of Congress leaders',
      'Widespread civil disobedience',
      'International pressure on Britain',
      'Acceleration toward independence'
    ]
  }
];

export const historicalDocuments: HistoricalDocument[] = [
  {
    id: 'ashoka-edicts',
    title: 'Edicts of Ashoka',
    author: 'Emperor Ashoka',
    period: 'ancient-india',
    date: '3rd century BCE',
    type: 'inscription',
    description: 'A collection of 33 inscriptions on rocks and pillars created by Emperor Ashoka throughout his empire, written in Prakrit and Greek.',
    significance: 'Provide invaluable insights into Ashoka\'s philosophy of governance, his conversion to Buddhism, and the administrative policies of the Mauryan Empire.',
    content: 'All men are my children. What I desire for my own children, and I desire their welfare and happiness both in this world and the next, that I desire for all men...',
    language: 'Prakrit, Greek, Aramaic'
  },
  {
    id: 'akbarnama',
    title: 'Akbarnama',
    author: 'Abul Fazl',
    period: 'medieval-india',
    date: '1590 CE',
    type: 'book',
    description: 'The official chronicle of the reign of Akbar, written by his court historian Abul Fazl. It provides detailed accounts of Akbar\'s life, administration, and policies.',
    significance: 'Serves as the primary source for understanding Akbar\'s reign and Mughal administrative practices, offering insights into 16th-century Indian society and culture.',
    content: 'His Majesty Akbar\'s actions proceed from profound wisdom and are the result of mature deliberation...',
    language: 'Persian'
  },
  {
    id: 'azad-hind-proclamation',
    title: 'Azad Hind Government Proclamation',
    author: 'Subhas Chandra Bose',
    period: 'modern-india',
    date: '1943 CE',
    type: 'charter',
    description: 'The founding document of the Provisional Government of Free India, established by Subhas Chandra Bose during World War II.',
    significance: 'Represents the first attempt to establish an independent Indian government and demonstrates the international dimension of the Indian independence movement.',
    content: 'We, the Provisional Government of Azad Hind, do hereby proclaim the independence of India and the establishment of a free Indian state...',
    language: 'English, Hindi'
  }
];

export const getHistoricalFiguresByPeriod = (periodId: string): HistoricalFigure[] => {
  return historicalFigures.filter(figure => figure.period === periodId);
};

export const getHistoricalEventsByPeriod = (periodId: string): HistoricalEvent[] => {
  return historicalEvents.filter(event => event.period === periodId);
};

export const getHistoricalDocumentsByPeriod = (periodId: string): HistoricalDocument[] => {
  return historicalDocuments.filter(doc => doc.period === periodId);
};