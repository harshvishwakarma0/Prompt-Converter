export enum TemplateName {
  GENERAL = 'General',
  IMAGE = 'Image Prompt',
  BLOG = 'Blog Prompt',
  CODING = 'Coding Prompt',
  VIDEO = 'Video Prompt',
  ADS = 'Ads/Marketing Prompt',
}

export enum OutputFormat {
  TEXT = 'text',
  JSON = 'json',
}

export interface Template {
  id: TemplateName;
  name: string;
  isPremium: boolean;
}

export interface HistoryItem {
  id: number;
  prompt: string;
  timestamp: string;
}