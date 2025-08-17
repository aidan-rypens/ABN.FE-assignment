import { TV_MAZE_API_URL } from "~~/server/api/constants";
import { Show } from "~~/server/types/api.typings";
import { TVMazeShow } from "~~/server/types/tvMaze.typings";
import { isValidGenre } from "~~/server/utils/genres";

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
    const limit = parseInt(query.limit as string) || 20;
    const offset = parseInt(query.offset as string) || 0;
    const sort = (query.sort as string) || "rating";

    if (!genreName || !isValidGenre(genreName)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid genre: ${genreName}`,
      });
    }

    const cacheKey = `genre:${genreName.toLowerCase()}:all:${sort}`;

    try {
      const storage = useStorage("memory");
      let allShows = (await storage.getItem(cacheKey)) as Show[];

      // If not cached, fetch and process all shows
      if (!allShows) {
        const shows = await $fetch<TVMazeShow[]>(
          `${TV_MAZE_API_URL}/shows?page=0`
        );

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
            genres: show.genres,
            language: show.language,
            runtime: show.runtime,
            network: show.network,
            schedule: show.schedule,
            officialSite: show.officialSite,
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

        allShows = filteredShows;
        await storage.setItem(cacheKey, allShows, { ttl: 1800 });
      }

      const paginatedShows = allShows.slice(offset, offset + limit);
      const hasMore = offset + limit < allShows.length;

      return {
        shows: paginatedShows,
        hasMore,
        totalCount: allShows.length,
      };
    } catch (error) {
      console.error(`Failed to fetch shows for genre ${genreName}:`, error);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch shows for genre: ${genreName}`,
      });
    }
  }
);
