export interface Show {
  id: number;
  name: string;
  summary: string;
  image: {
    medium: string;
    original: string;
  } | null;
  genres: string[];
  rating: number | null;
  premiered?: string;
  network?: {
    name: string;
    country: {
      name: string;
      code: string;
    };
  };
  status: string;
  language: string;
  runtime?: number;
}

export interface SearchResult extends Show {
  score: number;
}

export interface DetailedShow extends Show {
  ended?: string;
  webChannel?: any;
  schedule: {
    time: string;
    days: string[];
  };
  officialSite?: string;
  cast: Array<{
    person: {
      id: number;
      name: string;
      image?: any;
    };
    character: {
      id: number;
      name: string;
      image?: any;
    };
  }>;
  episodes: {
    total: number;
    seasons: number;
  };
}

export interface GenreGroup {
  genre: string;
  shows: Show[];
}

export interface APIError {
  statusCode: number;
  statusMessage: string;
}
