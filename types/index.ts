import { RatingTemplate } from '@/types/client';

export const CONTENT_CATEGORIES = [
  'dark_themes',
  'profanity',
  'romance',
  'substance_use',
  'violence',
  'max_age_rating',
] as const;

export type ContentCategory = (typeof CONTENT_CATEGORIES)[number];
export type ContentRestrictions = Record<ContentCategory, number>;

export interface AgeSettingsState {
  selectedOption: RatingTemplate | null;
  isUpdating: boolean;
}
