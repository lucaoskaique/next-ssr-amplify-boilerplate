// Generic types for the application

export interface Profile {
  id: string;
  name: string;
  avatar?: string;
  isParent?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt?: string;
}

export interface UserLoginResponse {
  session: Session;
  profiles: Profile[];
  userId: string;
}

export interface RatingTemplate {
  id: string;
  name: string;
  description?: string;
  settings?: any;
}

export interface AgentPersona {
  id: string;
  codename: string;
  name: string;
  template: string;
  voice_id?: string;
  similarity_boost?: number;
  stability?: number;
  style?: number;
  use_speaker_boost?: boolean;
  model_id?: string;
  image?: string;
  thumbnail?: string;
  sample_audio?: string;
}

export enum Provider {
  Netflix = 'NETFLIX',
  Disney = 'DISNEY',
  YouTube = 'YOUTUBE',
  YouTubeKids = 'YOUTUBE_KIDS',
}

export enum AgeRating {
  G = 'G',
  PG = 'PG',
  PG13 = 'PG13',
  R = 'R',
  NR = 'NR',
}

export enum MaxAgeRatingFilter {
  FIVE = 5,
  SEVEN = 7,
  NINE = 9,
  TWELVE = 12,
  FIFTEEN = 15,
  EIGHTEEN = 18,
}

export interface ShowRatingsFilters {
  provider?: Provider[];
  ageRating?: AgeRating[];
}

export interface VideoSearchResult {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: number;
  provider?: Provider;
  ageRating?: AgeRating;
}

export interface VideoDetails extends VideoSearchResult {
  fullDescription?: string;
  releaseDate?: string;
  genres?: string[];
}

export interface YouTubeContent extends VideoSearchResult {
  videoId: string;
  channelId?: string;
  channelTitle?: string;
}

export interface VisualAid {
  type: string;
  data?: any;
}

export function isImagesCue(aid: VisualAid): boolean {
  return aid.type === 'images';
}

export interface ContentRestrictions {
  dark_themes?: number;
  profanity?: number;
  romance?: number;
  substance_use?: number;
  violence?: number;
  max_age_rating?: number;
}

// Generic API Client class
export class Client {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Add your API methods here as needed
  async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}
