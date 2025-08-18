import type { Show } from "~~/server/types/api.typings";

const DEFAULT_LIMIT = 20;

const globalSearchResults = ref<Record<string, Show[]>>({});
const globalSearchLoading = ref(false);
const currentSearchQuery = ref<string>("");

export const useInfiniteCarousel = (genre: string) => {
  const route = useRoute();
  const searchQuery = computed(() => (route.query.q as string) || "");
  const isSearchMode = computed(
    () => searchQuery.value && searchQuery.value.trim().length >= 2
  );

  const shows = ref<Show[]>([]);
  const isLoading = ref(false);
  const isLoadingMore = ref(false);
  const hasMore = ref(true);
  const cursor = ref<string>();
  const error = ref<string | null>(null);
  const abortController = ref<AbortController>();

  const performGlobalSearch = async (query: string) => {
    const isSearchingSameQuery =
      currentSearchQuery.value === query && globalSearchLoading.value;
    if (isSearchingSameQuery) {
      return;
    }

    const alreadyHaveResultsForThisQuery =
      currentSearchQuery.value === query &&
      Object.keys(globalSearchResults.value).length > 0;
    if (alreadyHaveResultsForThisQuery) {
      return;
    }

    currentSearchQuery.value = query;
    globalSearchLoading.value = true;
    globalSearchResults.value = {};

    try {
      const response = await $fetch<{
        buckets: Record<
          string,
          { items: Show[]; hasMore: boolean; totalCount: number }
        >;
      }>("/api/shows", {
        query: { mode: "search", q: query },
      });

      Object.entries(response.buckets).forEach(([genreName, data]) => {
        globalSearchResults.value[genreName] = data.items;
      });
    } catch (err) {
      console.error("Search failed:", err);
      error.value = "Search failed";
    } finally {
      globalSearchLoading.value = false;
    }
  };

  const fetchBrowseShows = async (loadMore = false) => {
    if (isSearchMode.value) return;

    const loading = loadMore ? isLoadingMore : isLoading;
    if (loading.value || (loadMore && !hasMore.value)) return;

    loading.value = true;
    error.value = null;

    if (abortController.value) {
      abortController.value.abort();
    }
    abortController.value = new AbortController();

    try {
      const response = await $fetch<{
        items: Show[];
        nextCursor?: string;
        hasMore: boolean;
        totalCount: number;
      }>("/api/shows", {
        query: {
          mode: "browse",
          genre,
          cursor: loadMore ? cursor.value : undefined,
          limit: DEFAULT_LIMIT,
        },
        signal: abortController.value.signal,
      });

      if (loadMore) {
        shows.value.push(...response.items);
      } else {
        shows.value = response.items;
      }

      cursor.value = response.nextCursor;
      hasMore.value = response.hasMore;
    } catch (err: any) {
      if (err.name !== "AbortError") {
        error.value = `Failed to load ${genre} shows`;
      }
    } finally {
      loading.value = false;
    }
  };

  const loadMore = () => {
    if (!isSearchMode.value && hasMore.value && !isLoadingMore.value) {
      fetchBrowseShows(true);
    }
  };

  watch(searchQuery, async (newQuery) => {
    if (newQuery && newQuery.trim().length >= 2) {
      await performGlobalSearch(newQuery);
    } else {
      globalSearchResults.value = {};
      currentSearchQuery.value = "";

      if (shows.value.length === 0) {
        fetchBrowseShows();
      }
    }
  });

  onMounted(() => {
    if (isSearchMode.value) {
      performGlobalSearch(searchQuery.value);
    } else {
      fetchBrowseShows();
    }
  });

  onUnmounted(() => {
    if (abortController.value) {
      abortController.value.abort();
    }
  });

  const displayShows = computed(() => {
    return isSearchMode.value
      ? globalSearchResults.value[genre] || []
      : shows.value;
  });

  const displayLoading = computed(() => {
    return isSearchMode.value ? globalSearchLoading.value : isLoading.value;
  });

  const displayHasMore = computed(() => {
    return isSearchMode.value ? false : hasMore.value;
  });

  return {
    shows: readonly(displayShows),
    isLoading: readonly(displayLoading),
    isLoadingMore: readonly(isLoadingMore),
    hasMore: readonly(displayHasMore),
    error: readonly(error),
    loadMore,
    refresh: () =>
      isSearchMode.value
        ? performGlobalSearch(searchQuery.value)
        : fetchBrowseShows(),
  };
};
