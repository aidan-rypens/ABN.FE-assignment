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
}

export default defineEventHandler(
  async (
    event
  ): Promise<{
    shows: Show[];
    hasMore: boolean;
    totalCount: number;
  }> => {
    const genreName = getRouterParam(event, "genre") as string;
    const query = getQuery(event);

    const params: QueryParams = {
      limit: parseInt(query.limit as string) || 20,
      offset: parseInt(query.offset as string) || 0,
      sort: (query.sort as string) || "rating",
      searchQuery: query.q as string,
    };

    if (!genreName || !isValidGenre(genreName)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid genre: ${genreName}`,
      });
    }

    const cacheKey = createCacheKey(genreName, params.sort, params.searchQuery);

    try {
      const storage = useStorage("memory");
      let allShows = (await storage.getItem(cacheKey)) as Show[];

      if (!allShows) {
        const rawShows = await fetchShows(params.searchQuery);
        const filteredShows = filterShowsByGenre(rawShows, genreName);
        const sortedShows = sortShows(filteredShows, params.sort);

        allShows = sortedShows;

        const ttl = getCacheTTL(params.searchQuery);
        await storage.setItem(cacheKey, allShows, { ttl });
      }

      return paginateResults(allShows, params.offset, params.limit);
    } catch (error) {
      console.error(`Failed to fetch shows for genre ${genreName}:`, error);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch shows for genre: ${genreName}`,
      });
    }
  }
);

function createCacheKey(
  genreName: string,
  sort: string,
  searchQuery?: string
): string {
  return searchQuery
    ? `genre:${genreName.toLowerCase()}:search:${searchQuery.toLowerCase()}:${sort}`
    : `genre:${genreName.toLowerCase()}:all:${sort}`;
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

function filterShowsByGenre(shows: TVMazeShow[], genreName: string): Show[] {
  return shows
    .filter((show) =>
      show.genres.some((g) => g.toLowerCase() === genreName.toLowerCase())
    )
    .map((show) => ({
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

function paginateResults(shows: Show[], offset: number, limit: number) {
  const paginatedShows = shows.slice(offset, offset + limit);
  const hasMore = offset + limit < shows.length;

  return {
    shows: paginatedShows,
    hasMore,
    totalCount: shows.length,
  };
}

function getCacheTTL(searchQuery?: string): number {
  // Cache for shorter time when searching (15 minutes vs 30 minutes)
  return searchQuery ? 900 : 1800;
}
