
export type Language = 'zh' | 'en' | 'ms';

export interface LearningItem {
  id: string;
  category: string;
  translations: {
    zh: string;
    en: string;
    ms: string;
  };
  pinyin?: string;
  imageUrl: string;
  audioUrl?: string;
}

export interface Category {
  id: string;
  label: {
    zh: string;
    en: string;
    ms: string;
  };
  icon: string;
  color: string;
  imageUrl?: string;
  group?: 'vocabulary' | 'sentences' | 'dialogue';
}

export interface AICertificate {
  id: string;
  type: 'story' | 'drawing';
  title: string;
  date: string;
  previewImage?: string;
  content?: string;
  analysis?: string;
  studentName?: string;
}
