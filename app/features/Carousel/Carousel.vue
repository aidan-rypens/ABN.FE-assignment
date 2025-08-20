<script setup lang="ts">
import debounce from "lodash.debounce";

import CarouselArrow from "./CarouselArrow.vue";
import CarouselItem from "./CarouselItem.vue";
import CarouselHeader from "./CarouselHeader.vue";
import { useInfiniteCarousel } from "~/composables/useInfiniteCarousel";
import { useCarouselRegistry } from "~/composables/useCarouselRegistry";
import type { Show } from "~~/server/types/api.typings";

const { genre } = defineProps<{
  genre: string;
}>();

const { shows, isLoading, isLoadingMore, hasMore, error, loadMore } =
  useInfiniteCarousel(genre);

const { registerCarousel, updateCarousel, unregisterCarousel } =
  useCarouselRegistry();

const shouldShowCarousel = computed(() => {
  return isLoading.value || shows.value.length > 0;
});

const scrollContainer = ref<HTMLElement | null>(null);

const canScrollLeft = ref(false);
const canScrollRight = ref(false);

const updateScrollArrows = () => {
  if (!scrollContainer.value) return;

  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value;

  canScrollLeft.value = scrollLeft > 0;
  canScrollRight.value = scrollLeft + clientWidth < scrollWidth - 1;
};

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

  setTimeout(updateScrollArrows, 300);
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

const handleScroll = debounce(() => {
  updateScrollArrows();
  checkAndLoadMore();
}, 200);

// Register this carousel and keep its state updated
onMounted(() => {
  registerCarousel(genre, {
    isLoading: isLoading.value,
    hasShows: shows.value.length > 0,
    error: error.value,
  });
  scrollContainer.value?.addEventListener("scroll", handleScroll);
  nextTick(updateScrollArrows);
});

onUnmounted(() => {
  unregisterCarousel(genre);
  scrollContainer.value?.removeEventListener("scroll", handleScroll);
});

watch([isLoading, shows, error], () => {
  updateCarousel(genre, {
    isLoading: isLoading.value,
    hasShows: shows.value.length > 0,
    error: error.value,
  });
});

watch(
  () => shows.value.length,
  () => {
    nextTick(updateScrollArrows);
  }
);
</script>

<template>
  <div v-if="shouldShowCarousel" class="relative">
    <CarouselHeader
      :isLoading="isLoading"
      :genre="genre"
      :onScrollLeft="() => scroll('left')"
      :onScrollRight="() => scroll('right')"
      :canScrollLeft="canScrollLeft"
      :canScrollRight="canScrollRight"
    />

    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
    <div class="relative">
      <div
        ref="scrollContainer"
        class="flex gap-x-4 overflow-x-auto h-80 scrollbar-hide scroll-smooth"
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
            :rating="show.rating || null"
            :imageSrc="show?.image?.medium"
            :show="show as Show"
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
        <CarouselArrow
          v-if="canScrollLeft"
          direction="left"
          :onClick="() => scroll('left')"
        />
        <CarouselArrow
          v-if="canScrollRight"
          direction="right"
          :onClick="() => scroll('right')"
        />
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
