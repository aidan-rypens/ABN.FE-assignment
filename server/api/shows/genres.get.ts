import {
  getSortedGenresByPopularity,
  TVGenreData,
} from "~~/server/utils/genres";

export default defineEventHandler(async (event): Promise<TVGenreData[]> => {
  return getDashboardGenres();
});
