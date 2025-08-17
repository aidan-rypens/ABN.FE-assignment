<script setup lang="ts">
import CarouselArrow from "./CarouselArrow.vue";
import CarouselItem from "./CarouselItem.vue";
import { useInfiniteCarousel } from "~/composables/useInfiniteCarousel";

const { genre, sort } = withDefaults(
  defineProps<{
    genre: string;
    sort?: "rating";
  }>(),
  {
    sort: "rating",
  }
);

const { shows, isLoading, isLoadingMore, hasMore, error, loadMore } =
  useInfiniteCarousel(genre, sort);

const scrollContainer = ref<HTMLElement | null>(null);

const scroll = (direction: "left" | "right") => {
  if (!scrollContainer.value) return;

  const itemWidth = 192 + 48; // w-48 (192px) + gap-x-12 (48px)
  const visibleItems = Math.floor(
    scrollContainer.value.clientWidth / itemWidth
  );
  const scrollAmount = itemWidth * Math.max(1, visibleItems - 1);

  const currentScroll = scrollContainer.value.scrollLeft;
  const newPosition =
    direction === "right"
      ? currentScroll + scrollAmount
      : currentScroll - scrollAmount;

  scrollContainer.value.scrollTo({
    left: Math.max(0, newPosition),
    behavior: "smooth",
  });

  if (direction === "right") {
    checkAndLoadMore();
  }
};

const checkAndLoadMore = () => {
  if (!scrollContainer.value || !hasMore.value) return;

  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value;
  const scrollPercentage = (scrollLeft + clientWidth) / scrollWidth;
  const scrollThresholdIsReached = scrollPercentage > 0.75;

  if (scrollThresholdIsReached && !isLoadingMore.value) {
    loadMore();
  }
};

const handleScroll = debounce(checkAndLoadMore, 200);

onMounted(() => {
  scrollContainer.value?.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  scrollContainer.value?.removeEventListener("scroll", handleScroll);
});

function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
</script>

<template>
  <div class="relative">
    <h2 class="text-2xl font-bold mb-4">
      <template v-if="isLoading">
        <div class="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
      </template>
      <template v-else>
        {{ genre }}
      </template>
    </h2>

    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>

    <div class="relative">
      <div
        ref="scrollContainer"
        class="flex gap-x-12 overflow-x-auto h-[25rem] scrollbar-hide scroll-smooth"
      >
        <template v-if="isLoading">
          <CarouselItem
            v-for="n in 5"
            :key="n"
            name=""
            :rating="0"
            :isLoading="true"
          />
        </template>
        <template v-else>
          <CarouselItem
            v-for="show in shows"
            :key="show.id"
            :name="show.name"
            :rating="show.rating"
            :imageSrc="show?.image?.medium"
          />

          <CarouselItem
            v-if="isLoadingMore"
            v-for="n in 3"
            :key="`loading-${n}`"
            name=""
            :rating="0"
            :isLoading="true"
          />
        </template>
      </div>

      <template v-if="!isLoading">
        <CarouselArrow direction="left" :onClick="() => scroll('left')" />
        <CarouselArrow direction="right" :onClick="() => scroll('right')" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scroll-smooth {
  scroll-behavior: smooth;
}
</style>
