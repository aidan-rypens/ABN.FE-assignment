import { TVGenreData } from "~~/server/utils/genres";

export default defineEventHandler(async (): Promise<TVGenreData[]> => {
  return getDashboardGenres();
});
