<script setup lang="ts">
import ApiErrorBanner from "~/features/ApiErrorBanner.vue";
import Carousel from "~/components/Carousel/Carousel.vue";

const { data: genres } = await useFetch<TVGenreData[]>("/api/shows/genres");
</script>

<template>
  <ApiErrorBanner />
  <h1 class="text-4xl font-bold">Dashboard</h1>
  <div class="flex flex-col gap-y-12">
    <Carousel
      v-for="genre in genres"
      :key="genre.name"
      :genre="genre.name"
      :limit="20"
    />
  </div>
</template>
