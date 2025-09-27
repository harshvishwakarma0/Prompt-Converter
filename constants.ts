
import { Template, TemplateName } from './types';

export const TEMPLATES: Template[] = [
  { id: TemplateName.GENERAL, name: 'General', isPremium: false },
  { id: TemplateName.IMAGE, name: 'Image Prompt', isPremium: false },
  { id: TemplateName.BLOG, name: 'Blog Prompt', isPremium: false },
  { id: TemplateName.CODING, name: 'Coding Prompt', isPremium: true },
  { id: TemplateName.VIDEO, name: 'Video Prompt', isPremium: true },
  { id: TemplateName.ADS, name: 'Ads/Marketing Prompt', isPremium: true },
];
