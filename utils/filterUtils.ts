import {
  Provider,
  AgeRating,
  type ShowRatingsFilters,
} from '@/types/client';

interface UIFilters {
  provider: Provider[];
}

/**
 * Converts UI filter values to API filter format
 */
export const getApiFilters = (filters: UIFilters): ShowRatingsFilters => {
  const apiFilters: ShowRatingsFilters = {};

  if (filters.provider && filters.provider.length > 0) {
    apiFilters.provider = filters.provider;
  }

  return apiFilters;
};

/**
 * Default filter values - updated for multi-select
 */
export const defaultFilters: UIFilters = {
  provider: [Provider.Netflix, Provider.Disney],
};

/**
 * Filter options for dropdowns
 */
export const filterOptions = {
  ageRecommendation: ['7+', '10+', '13+', '16+', '18+'],
  ageRating: [AgeRating.G, AgeRating.PG, AgeRating.PG13, 'PG-13+'],
  provider: [Provider.Netflix, Provider.Disney, Provider.YouTube],
};

export const getProviderTooltip = (provider: Provider): string => {
  switch (provider) {
    case Provider.YouTube:
      return `YouTube Kids uses broad safe search filters but doesn't yet support custom ratings.`;
    default:
      return '';
  }
};
