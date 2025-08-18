import type { Show } from "~~/server/types/api.typings";

export const useGlobalSearch = () => {
  const route = useRoute();
  const searchQuery = computed(() => (route.query.q as string) || "");
  const hasSearchQuery = computed(
    () => searchQuery.value && searchQuery.value.trim().length >= 2
  );

  const {
    data: searchData,
    pending: isSearching,
    error: searchError,
  } = useLazyFetch<{
    shows: Show[];
    hasMore: boolean;
    totalCount: number;
  }>("/api/shows", {
    query: {
      q: searchQuery,
      sort: "rating",
    },
    default: () => ({ shows: [], hasMore: false, totalCount: 0 }),
    watch: [searchQuery],
    server: false,
  });

  const allSearchResults = computed(() => searchData.value?.shows || []);

  const getSearchResultsForGenre = (genre: string): Show[] => {
    if (!hasSearchQuery.value) return [];

    return allSearchResults.value.filter((show) =>
      show.genres.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
  };

  return {
    searchQuery: readonly(searchQuery),
    hasSearchQuery: readonly(hasSearchQuery),
    isSearching: readonly(isSearching),
    searchError: readonly(searchError),
    getSearchResultsForGenre,
  };
};
