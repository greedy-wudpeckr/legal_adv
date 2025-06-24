export interface SoundEffect {
  id: string;
  name: string;
  url: string;
  volume?: number;
}

export const SOUND_EFFECTS: Record<string, SoundEffect> = {
  gavel: {
    id: 'gavel',
    name: 'Gavel Bang',
    url: '/sounds/gavel.mp3',
    volume: 0.7
  },
  objection: {
    id: 'objection',
    name: 'Objection',
    url: '/sounds/objection.mp3',
    volume: 0.8
  },
  courtroom_ambience: {
    id: 'courtroom_ambience',
    name: 'Courtroom Ambience',
    url: '/sounds/courtroom-ambience.mp3',
    volume: 0.3
  },
  success: {
    id: 'success',
    name: 'Success Chime',
    url: '/sounds/success.mp3',
    volume: 0.6
  },
  failure: {
    id: 'failure',
    name: 'Failure Sound',
    url: '/sounds/failure.mp3',
    volume: 0.6
  },
  paper_shuffle: {
    id: 'paper_shuffle',
    name: 'Paper Shuffle',
    url: '/sounds/paper-shuffle.mp3',
    volume: 0.4
  }
};