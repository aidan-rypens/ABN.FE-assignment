import { TV_MAZE_API_URL } from "~~/server/constants";
import { TVMazeShow } from "~~/server/types/tvMaze.typings";
import { isValidGenre } from "~~/server/utils/genres";

export default defineEventHandler(async (event): Promise<any[]> => {
  const genreName = getRouterParam(event, "genre") as string;
  const query = getQuery(event);
  const limit = parseInt(query.limit as string) || 20;
  const sort = (query.sort as string) || "rating";

  if (!genreName || !isValidGenre(genreName)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid genre: ${genreName}`,
    });
  }

  const cacheKey = `genre:${genreName.toLowerCase()}:${limit}:${sort}`;

  try {
    const storage = useStorage("memory");
    const cached = await storage.getItem(cacheKey);
    if (cached) {
      return cached as any[];
    }

    const shows = await $fetch<TVMazeShow[]>(`${TV_MAZE_API_URL}/shows?page=0`);

    let filteredShows = shows
      .filter((show) =>
        show.genres.some((g) => g.toLowerCase() === genreName.toLowerCase())
      )
      .map((show) => ({
        id: show.id,
        name: show.name,
        summary:
          show.summary?.replace(/<[^>]*>/g, "") || "No summary available",
        image: show.image || null,
        rating: show.rating?.average || 0,
        premiered: show.premiered,
        status: show.status,
      }));

    switch (sort) {
      case "rating":
        filteredShows.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filteredShows.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "premiered":
        filteredShows.sort((a, b) => {
          const dateA = new Date(a.premiered || "1900-01-01");
          const dateB = new Date(b.premiered || "1900-01-01");
          return dateB.getTime() - dateA.getTime();
        });
        break;
    }

    const limitedShows = filteredShows.slice(0, limit);

    await storage.setItem(cacheKey, limitedShows, { ttl: 1800 });

    return limitedShows;
  } catch (error) {
    console.error(`Failed to fetch shows for genre ${genreName}:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch shows for genre: ${genreName}`,
    });
  }
});
