export const TV_GENRES = [
  { name: "Action", isFeatured: true, popularity: 85 },
  { name: "Adult", isFeatured: false, popularity: 15 },
  { name: "Adventure", isFeatured: true, popularity: 70 },
  { name: "Anime", isFeatured: true, popularity: 65 },
  { name: "Children", isFeatured: true, popularity: 50 },
  { name: "Comedy", isFeatured: true, popularity: 95 },
  { name: "Crime", isFeatured: true, popularity: 80 },
  { name: "DIY", isFeatured: false, popularity: 25 },
  { name: "Drama", isFeatured: true, popularity: 100 },
  { name: "Espionage", isFeatured: true, popularity: 45 },
  { name: "Family", isFeatured: true, popularity: 75 },
  { name: "Fantasy", isFeatured: true, popularity: 85 },
  { name: "Food", isFeatured: false, popularity: 35 },
  { name: "History", isFeatured: true, popularity: 40 },
  { name: "Horror", isFeatured: true, popularity: 70 },
  { name: "Legal", isFeatured: true, popularity: 55 },
  { name: "Medical", isFeatured: true, popularity: 60 },
  { name: "Music", isFeatured: false, popularity: 30 },
  { name: "Mystery", isFeatured: true, popularity: 75 },
  { name: "Nature", isFeatured: false, popularity: 20 },
  { name: "Romance", isFeatured: true, popularity: 80 },
  { name: "Science-Fiction", isFeatured: true, popularity: 90 },
  { name: "Sports", isFeatured: true, popularity: 65 },
  { name: "Supernatural", isFeatured: true, popularity: 85 },
  { name: "Thriller", isFeatured: true, popularity: 88 },
  { name: "Travel", isFeatured: false, popularity: 25 },
  { name: "War", isFeatured: true, popularity: 45 },
  { name: "Western", isFeatured: true, popularity: 35 },
] as const;

export type TVGenreData = (typeof TV_GENRES)[number];

export function getSortedGenresByPopularity(): TVGenreData[] {
  return [...TV_GENRES].sort((a, b) => b.popularity - a.popularity);
}

export function getGenreNames(): TVGenre[] {
  return TV_GENRES.map((genre) => genre.name);
}

export function getDashboardGenres(): TVGenreData[] {
  return TV_GENRES.filter((genre) => genre.isFeatured).sort(
    (a, b) => b.popularity - a.popularity
  );
}

export function getPopularGenres(limit: number = 10): TVGenreData[] {
  return [...TV_GENRES]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export function getGenreByName(name: string): TVGenreData | undefined {
  return TV_GENRES.find(
    (genre) => genre.name.toLowerCase() === name.toLowerCase()
  );
}

export function isValidGenre(name: string): name is TVGenre {
  return TV_GENRES.some((genre) => genre.name === name);
}
