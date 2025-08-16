export interface TVMazeShow {
  id: number;
  name: string;
  summary?: string;
  image?: {
    medium: string;
    original: string;
  };
  genres: string[];
  rating: {
    average?: number;
  };
  premiered?: string;
  ended?: string;
  network?: {
    name: string;
    country: {
      name: string;
      code: string;
    };
  };
  webChannel?: any;
  status: string;
  language: string;
  runtime?: number;
  schedule: {
    time: string;
    days: string[];
  };
  officialSite?: string;
  _embedded?: {
    cast?: Array<{
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
    episodes?: Array<{
      id: number;
      season: number;
      number: number;
      name: string;
    }>;
  };
}

export interface TVMazeSearchResult {
  score: number;
  show: TVMazeShow;
}
