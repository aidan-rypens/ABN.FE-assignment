import type { Show } from "~~/server/types/api.typings";

export const useInfiniteCarousel = (genre: string, sort: string = "rating") => {
  const shows = ref<Show[]>([]);
  const isLoading = ref(false);
  const isLoadingMore = ref(false);
  const hasMore = ref(true);
  const error = ref<string | null>(null);
  const offset = ref(0);
  const limit = 20;

  const loadShows = async (reset = false) => {
    if (reset) {
      offset.value = 0;
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
          limit,
          offset: offset.value,
          sort,
        },
      });

      if (reset) {
        shows.value = response.shows;
      } else {
        shows.value.push(...response.shows);
      }

      hasMore.value = response.hasMore;
      offset.value += limit;
    } catch (err) {
      error.value = `Failed to load ${genre} shows`;
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
