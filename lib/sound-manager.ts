import { SOUND_EFFECTS, SoundEffect } from '@/types/sound';

class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.7;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadSounds();
      this.enabled = localStorage.getItem('sound_enabled') !== 'false';
      const savedVolume = localStorage.getItem('sound_volume');
      if (savedVolume) {
        this.volume = parseFloat(savedVolume);
      }
    }
  }

  private loadSounds() {
    Object.values(SOUND_EFFECTS).forEach((effect) => {
      const audio = new Audio(effect.url);
      audio.volume = (effect.volume || 0.5) * this.volume;
      audio.preload = 'auto';
      this.sounds.set(effect.id, audio);
    });
  }

  play(soundId: string) {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(soundId);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {
        // Ignore autoplay restrictions
      });
    }
  }

  playLoop(soundId: string) {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(soundId);
    if (sound) {
      sound.loop = true;
      sound.currentTime = 0;
      sound.play().catch(() => {
        // Ignore autoplay restrictions
      });
    }
  }

  stop(soundId: string) {
    const sound = this.sounds.get(soundId);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
      sound.loop = false;
    }
  }

  stopAll() {
    this.sounds.forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
      sound.loop = false;
    });
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('sound_enabled', enabled.toString());
    if (!enabled) {
      this.stopAll();
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('sound_volume', this.volume.toString());
    
    this.sounds.forEach((sound, id) => {
      const effect = SOUND_EFFECTS[id];
      sound.volume = (effect.volume || 0.5) * this.volume;
    });
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getVolume(): number {
    return this.volume;
  }
}

export const soundManager = new SoundManager();