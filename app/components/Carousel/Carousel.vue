<script setup lang="ts">
import type { Show } from "~~/server/types/api.typings";
import CarouselArrow from "./CarouselArrow.vue";
import CarouselItem from "./CarouselItem.vue";

const { genre, limit, sort } = withDefaults(
  defineProps<{
    genre: string;
    limit: number;
    sort?: "rating";
  }>(),
  {
    limit: 10,
    sort: "rating",
  }
);

const { data: shows, pending } = await useFetch<Show[]>(`/api/shows/${genre}`, {
  query: { limit, sort },
});

const scrollContainer = ref<HTMLElement | null>(null);

const scroll = (direction: "left" | "right") => {
  if (!scrollContainer.value) return;

  const itemWidth = 192 + 48;
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
};

const showCarouselArrows = computed(() => {
  return !pending.value && shows.value && shows.value.length > 0;
});
</script>

<template>
  <div class="relative">
    <h2 class="text-2xl font-bold mb-4">{{ genre }}</h2>
    <div class="relative">
      <div
        ref="scrollContainer"
        class="flex gap-x-12 overflow-x-auto h-[25rem] scrollbar-hide scroll-smooth"
      >
        <CarouselItem
          v-for="show in shows"
          :key="show.id"
          :name="show.name"
          :rating="show.rating"
          :imageSrc="show?.image?.medium"
          :isLoading="pending"
        />
      </div>
      <CarouselArrow
        v-if="showCarouselArrows"
        direction="left"
        :onClick="() => scroll('left')"
      />
      <CarouselArrow
        v-if="showCarouselArrows"
        direction="right"
        :onClick="() => scroll('right')"
      />
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
