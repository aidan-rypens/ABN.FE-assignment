<script setup lang="ts">
import ApiErrorBanner from "~/features/ApiErrorBanner.vue";
import Carousel from "~/features/Carousel/Carousel.vue";
import FeaturedItem from "~/features/Featured/FeaturedItem.vue";
import Search from "~/features/Search/Search.vue";
import { useCarouselRegistry } from "~/composables/useCarouselRegistry";

const { data: genres } = await useFetch<TVGenreData[]>("/api/shows/genres");
const { hasNoResults, hasErrors } = useCarouselRegistry();

const route = useRoute();
const searchQuery = computed(() => (route.query.q as string) || "");
const hasSearchQuery = computed(
  () => searchQuery.value && searchQuery.value.trim().length >= 2
);

const shouldShowNoResults = computed(() => {
  return hasSearchQuery.value && hasNoResults.value;
});
</script>

<template>
  <ApiErrorBanner />
  <div class="mx-6 flex flex-col gap-y-12" :class="{ 'pt-20': hasErrors }">
    <div class="flex flex-col items-end pt-12">
      <div class="md:max-w-xl w-full">
        <Search />
      </div>
    </div>
    <div v-if="!hasSearchQuery">
      <FeaturedItem
        title="Breaking Bad"
        subtitle="A high school chemistry teacher dying of cancer teams with a former student to secure his family's future by manufacturing and selling crystal meth."
        :rating="9.2"
      />
    </div>

    <div v-if="shouldShowNoResults" class="text-center py-12">
      <h2 class="text-2xl font-semibold text-white mb-2">No results found</h2>
      <p class="text-gray-400">
        Try adjusting your search term or browse our categories below
      </p>
    </div>

    <div class="flex flex-col gap-y-12">
      <Carousel v-for="genre in genres" :key="genre.name" :genre="genre.name" />
    </div>
  </div>
</template>
