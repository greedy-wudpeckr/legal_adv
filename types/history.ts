export interface HistoricalPeriod {
  id: string;
  name: string;
  timeRange: string;
  description: string;
  color: string;
  keyEvents: string[];
  culturalHighlights: string[];
}

export interface HistoricalFigure {
  id: string;
  name: string;
  period: string;
  timeRange: string;
  biography: string;
  achievements: string[];
  significance: string;
  avatarModel?: string;
  voiceId?: string;
  imageUrl?: string;
  quotes: string[];
}

export interface HistoricalEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  significance: string;
  period: string;
  location: string;
  keyFigures: string[];
  consequences: string[];
}

export interface HistoricalDocument {
  id: string;
  title: string;
  author: string;
  period: string;
  date: string;
  type: 'manuscript' | 'inscription' | 'charter' | 'treaty' | 'letter' | 'book';
  description: string;
  significance: string;
  content: string;
  language: string;
}