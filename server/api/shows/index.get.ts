import { TV_MAZE_API_URL } from "~~/server/api/constants";
import { Show } from "~~/server/types/api.typings";
import { TVMazeShow } from "~~/server/types/tvMaze.typings";
import { isValidGenre } from "~~/server/utils/genres";

interface TVMazeSearchResult {
  score: number;
  show: TVMazeShow;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const mode = (query.mode as string) || "browse";
  const genre = query.genre as string;
  const searchQuery = query.q as string;
  const cursor = query.cursor as string;
  const limit = parseInt(query.limit as string) || 20;

  const cacheKey = `${mode}:${genre || "all"}:${searchQuery || "none"}:${
    cursor || "0"
  }:${limit}`;
  const storage = useStorage("memory");

  let result = await storage.getItem(cacheKey);
  if (result) {
    return result;
  }

  try {
    if (mode === "search" && searchQuery) {
      result = await handleSearch(searchQuery, limit);
    } else if (mode === "browse" && genre) {
      result = await handleBrowse(genre, cursor, limit);
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid parameters",
      });
    }

    await storage.setItem(cacheKey, result, { ttl: 300 });
    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch shows",
    });
  }
});

async function handleBrowse(genre: string, cursor: string, limit: number) {
  if (!isValidGenre(genre)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid genre: ${genre}`,
    });
  }

  const storage = useStorage("memory");
  const genreKey = `all-shows-${genre}`;

  let allShows = (await storage.getItem(genreKey)) as Show[];
  if (!allShows) {
    const rawShows = await $fetch<TVMazeShow[]>(
      `${TV_MAZE_API_URL}/shows?page=0`
    );
    const filtered = rawShows
      .filter((show) =>
        show.genres.some((g) => g.toLowerCase() === genre.toLowerCase())
      )
      .map(transformShow)
      .sort((a, b) => b.rating - a.rating);

    allShows = filtered;
    await storage.setItem(genreKey, allShows, { ttl: 1800 }); // 30 min
  }

  const offset = cursor ? parseInt(cursor) : 0;
  const items = allShows.slice(offset, offset + limit);
  const hasMore = offset + limit < allShows.length;
  const nextCursor = hasMore ? String(offset + limit) : undefined;

  return {
    items,
    nextCursor,
    hasMore,
    totalCount: allShows.length,
  };
}

async function handleSearch(searchQuery: string, limit: number) {
  if (searchQuery.trim().length < 2) {
    throw createError({
      statusCode: 400,
      statusMessage: "Search query too short",
    });
  }

  const searchResults = await $fetch<TVMazeSearchResult[]>(
    `${TV_MAZE_API_URL}/search/shows?q=${encodeURIComponent(searchQuery)}`
  );

  const shows = searchResults.map((result) => transformShow(result.show));

  const buckets: Record<string, Show[]> = {};
  shows.forEach((show) => {
    show.genres.forEach((genre) => {
      if (!buckets[genre]) buckets[genre] = [];
      buckets[genre].push(show);
    });
  });

  const result: Record<string, any> = {};
  for (const [genre, genreShows] of Object.entries(buckets)) {
    const sorted = genreShows.sort((a, b) => b.rating - a.rating);
    result[genre] = {
      items: sorted.slice(0, limit),
      hasMore: sorted.length > limit,
      totalCount: sorted.length,
    };
  }

  return { buckets: result };
}

function transformShow(show: TVMazeShow): Show {
  return {
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
  };
}
