import type { Show } from "~~/server/types/api.typings";

const DEFAULT_LIMIT = 20;
const DEFAULT_SORT = "rating";
const INITIAL_OFFSET = 0;
const ERROR_MESSAGE_PREFIX = "Failed to load";

export const useInfiniteCarousel = (
  genre: string,
  sort: string = DEFAULT_SORT
) => {
  const route = useRoute();
  const searchQuery = computed(() => (route.query.q as string) || "");
  const shows = ref<Show[]>([]);
  const isLoading = ref(false);
  const isLoadingMore = ref(false);
  const hasMore = ref(true);
  const error = ref<string | null>(null);
  const offset = ref(INITIAL_OFFSET);

  const loadShows = async (reset = false) => {
    if (reset) {
      offset.value = INITIAL_OFFSET;
      shows.value = [];
      hasMore.value = true;
      error.value = null;
    }

    if (isLoading.value || isLoadingMore.value || !hasMore.value) return;

    const loading = offset.value === 0 ? isLoading : isLoadingMore;
    loading.value = true;

    try {
      const response = await $fetch<{
        shows: Show[];
        hasMore: boolean;
        totalCount: number;
      }>(`/api/shows/${genre}`, {
        query: {
          limit: DEFAULT_LIMIT,
          offset: offset.value,
          sort,
          q: searchQuery.value,
        },
      });

      if (reset) {
        shows.value = response.shows;
      } else {
        shows.value.push(...response.shows);
      }

      hasMore.value = response.hasMore;
      offset.value += DEFAULT_LIMIT;
    } catch (err) {
      error.value = `${ERROR_MESSAGE_PREFIX} ${genre} shows`;
      console.error("Error loading shows:", err);
    } finally {
      loading.value = false;
    }
  };

  const loadMore = () => {
    if (hasMore.value && !isLoadingMore.value) {
      loadShows();
    }
  };

  watch(searchQuery, () => {
    loadShows(true);
  });

  onMounted(() => {
    loadShows(true);
  });

  return {
    shows: readonly(shows),
    isLoading: readonly(isLoading),
    isLoadingMore: readonly(isLoadingMore),
    hasMore: readonly(hasMore),
    error: readonly(error),
    loadMore,
    refresh: () => loadShows(true),
  };
};
