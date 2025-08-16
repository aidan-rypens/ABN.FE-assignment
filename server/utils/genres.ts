export const TV_GENRES = [
  "Action",
  "Adult",
  "Adventure",
  "Anime",
  "Children",
  "Comedy",
  "Crime",
  "DIY",
  "Drama",
  "Espionage",
  "Family",
  "Fantasy",
  "Food",
  "History",
  "Horror",
  "Legal",
  "Medical",
  "Music",
  "Mystery",
  "Nature",
  "Romance",
  "Science-Fiction",
  "Sports",
  "Supernatural",
  "Thriller",
  "Travel",
  "War",
  "Western",
] as const;

export type TVGenre = (typeof TV_GENRES)[number];

export function getSortedGenres(): TVGenre[] {
  return [...TV_GENRES].sort();
}
