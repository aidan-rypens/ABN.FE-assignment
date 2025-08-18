import { TV_MAZE_API_URL } from "~~/server/api/constants";
import { Show } from "~~/server/types/api.typings";
import { TVMazeShow } from "~~/server/types/tvMaze.typings";
import { isValidGenre } from "~~/server/utils/genres";

interface TVMazeSearchResult {
  score: number;
  show: TVMazeShow;
}

interface QueryParams {
  limit: number;
  offset: number;
  sort: string;
  searchQuery?: string;
  genres: string[];
}

export default defineEventHandler(
  async (
    event
  ): Promise<{
    shows: Show[];
    hasMore: boolean;
    totalCount: number;
    genreResults?: Record<string, { shows: Show[]; totalCount: number }>;
  }> => {
    const query = getQuery(event);

    let genres: string[] = [];
    if (query.genres) {
      genres = Array.isArray(query.genres)
        ? (query.genres as string[])
        : [query.genres as string];
    } else if (query.genre) {
      genres = [query.genre as string];
    }

    const params: QueryParams = {
      limit: parseInt(query.limit as string) || 20,
      offset: parseInt(query.offset as string) || 0,
      sort: (query.sort as string) || "rating",
      searchQuery: query.q as string,
      genres,
    };

    for (const genre of params.genres) {
      if (!isValidGenre(genre)) {
        throw createError({
          statusCode: 400,
          statusMessage: `Invalid genre: ${genre}`,
        });
      }
    }

    const cacheKey = createCacheKey(params);

    try {
      const storage = useStorage("memory");
      let cachedResult = (await storage.getItem(cacheKey)) as any;

      if (!cachedResult) {
        const rawShows = await fetchShows(params.searchQuery);

        if (params.genres.length > 1) {
          const genreResults: Record<
            string,
            { shows: Show[]; totalCount: number }
          > = {};

          for (const genre of params.genres) {
            const filteredShows = filterShows(rawShows, genre);
            const sortedShows = sortShows(filteredShows, params.sort);

            genreResults[genre] = {
              shows: sortedShows.slice(
                params.offset,
                params.offset + params.limit
              ),
              totalCount: sortedShows.length,
            };
          }

          cachedResult = {
            shows: [],
            hasMore: false,
            totalCount: 0,
            genreResults,
          };
        } else {
          const genreFilter = params.genres[0] || undefined;
          const filteredShows = filterShows(rawShows, genreFilter);
          const sortedShows = sortShows(filteredShows, params.sort);

          const result = paginateResults(
            sortedShows,
            params.offset,
            params.limit,
            !!params.searchQuery
          );

          cachedResult = result;
        }

        const ttl = getCacheTTL(params.searchQuery);
        await storage.setItem(cacheKey, cachedResult, { ttl });
      }

      return cachedResult;
    } catch (error) {
      console.error(`❌ Failed to fetch shows:`, error);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch shows`,
      });
    }
  }
);

function createCacheKey(params: QueryParams): string {
  const genresKey =
    params.genres.length > 0 ? params.genres.sort().join(",") : "all";
  return params.searchQuery
    ? `search:${params.searchQuery.toLowerCase()}:genres:${genresKey}:${
        params.sort
      }`
    : `browse:genres:${genresKey}:${params.sort}:${params.offset}:${params.limit}`;
}

async function fetchShows(searchQuery?: string): Promise<TVMazeShow[]> {
  const useSearchEndpoint = searchQuery && searchQuery.trim().length >= 2;

  if (useSearchEndpoint) {
    const searchResults = await $fetch<TVMazeSearchResult[]>(
      `${TV_MAZE_API_URL}/search/shows?q=${encodeURIComponent(searchQuery)}`
    );
    return searchResults.map((result) => result.show);
  } else {
    return await $fetch<TVMazeShow[]>(`${TV_MAZE_API_URL}/shows?page=0`);
  }
}

function filterShows(shows: TVMazeShow[], genre?: string): Show[] {
  let filteredShows = shows;

  if (genre) {
    filteredShows = shows.filter((show) =>
      show.genres.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
  }

  return filteredShows.map((show) => ({
    id: show.id,
    name: show.name,
    summary: show.summary?.replace(/<[^>]*>/g, "") || "No summary available",
    image: show.image || null,
    rating: show.rating?.average || 0,
    premiered: show.premiered,
    status: show.status,
    genres: show.genres,
    language: show.language,
    runtime: show.runtime,
    network: show.network,
    schedule: show.schedule,
    officialSite: show.officialSite,
  }));
}

function sortShows(shows: Show[], sort: string): Show[] {
  const sortedShows = [...shows];

  switch (sort) {
    case "rating":
      sortedShows.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      sortedShows.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "premiered":
      sortedShows.sort((a, b) => {
        const dateA = new Date(a.premiered || "1900-01-01");
        const dateB = new Date(b.premiered || "1900-01-01");
        return dateB.getTime() - dateA.getTime();
      });
      break;
  }

  return sortedShows;
}

function paginateResults(
  shows: Show[],
  offset: number,
  limit: number,
  isSearch: boolean = false
) {
  if (isSearch) {
    return {
      shows: shows,
      hasMore: false,
      totalCount: shows.length,
    };
  }

  const paginatedShows = shows.slice(offset, offset + limit);
  const hasMore = offset + limit < shows.length;

  return {
    shows: paginatedShows,
    hasMore,
    totalCount: shows.length,
  };
}

function getCacheTTL(searchQuery?: string): number {
  return searchQuery ? 900 : 1800;
}
