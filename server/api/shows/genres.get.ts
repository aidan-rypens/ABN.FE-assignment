import { getSortedGenres } from "~~/server/utils/genres";

export default defineEventHandler(async (event): Promise<string[]> => {
  return getSortedGenres();
});
