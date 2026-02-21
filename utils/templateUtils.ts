// utils/templateUtils.ts
import type { ContentRestrictions, RatingTemplate } from '@/types/client';
import { CONTENT_CATEGORIES } from '@/types/index';

/**
 * Applies a template's settings to create new content restrictions
 */
export function applyTemplate(
  template: RatingTemplate,
  currentRestrictions?: ContentRestrictions,
): ContentRestrictions {
  const newRestrictions: ContentRestrictions = currentRestrictions
    ? { ...currentRestrictions }
    : ({} as ContentRestrictions);

  // Update all categories based on the template settings
  CONTENT_CATEGORIES.forEach(category => {
    const categoryKey = category
      .toLowerCase()
      .replace(' ', '_') as keyof typeof template.settings;

    if (template.settings[categoryKey] !== undefined) {
      (newRestrictions as any)[categoryKey] = template.settings[
        categoryKey
      ] as number;
    }
  });

  return newRestrictions;
}
