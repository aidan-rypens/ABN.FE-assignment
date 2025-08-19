<script setup lang="ts">
import ApiErrorBanner from "~/features/ApiErrorBanner.vue";
import Carousel from "~/features/Carousel/Carousel.vue";
import FeaturedItem from "~/features/Featured/FeaturedItem.vue";
import Search from "~/features/Search/Search.vue";

const { data: genres } = await useFetch<TVGenreData[]>("/api/shows/genres");

const route = useRoute();
const searchQuery = computed(() => (route.query.q as string) || "");
const hasSearchQuery = computed(
  () => searchQuery.value && searchQuery.value.trim().length >= 2
);
</script>

<template>
  <ApiErrorBanner />
  <div class="mx-6">
    <div class="flex flex-col items-end pt-12">
      <div class="max-w-xl w-full">
        <Search />
      </div>
    </div>
    <div v-if="!hasSearchQuery" class="my-12">
      <FeaturedItem
        title="Breaking Bad"
        subtitle="A high school chemistry teacher dying of cancer teams with a former student to secure his family's future by manufacturing and selling crystal meth."
        :rating="9.2"
      />
    </div>
    <div class="flex flex-col gap-y-12 pb-12">
      <Carousel v-for="genre in genres" :key="genre.name" :genre="genre.name" />
    </div>
  </div>
</template>
