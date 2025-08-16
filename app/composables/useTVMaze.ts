import { useQuery } from "@tanstack/vue-query";
import type { TVGenre } from "~~/server/utils/genres";

export const useGenres = () => {
  return useQuery({
    queryKey: ["genres"],
    queryFn: (): Promise<TVGenre[]> => $fetch("/api/shows/genres"),
    staleTime: 1000 * 60 * 60 * 24,
  });
};
