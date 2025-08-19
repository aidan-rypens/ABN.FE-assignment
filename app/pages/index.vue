<script setup lang="ts">
import ApiErrorBanner from "~/features/ApiErrorBanner.vue";
import Carousel from "~/features/Carousel/Carousel.vue";
import Search from "~/features/Search/Search.vue";

const { data: genres } = await useFetch<TVGenreData[]>("/api/shows/genres");
</script>

<template>
  <ApiErrorBanner />
  <div class="mx-6">
    <div class="flex flex-col items-end pt-12">
      <div class="max-w-2xl w-full">
        <Search />
      </div>
    </div>
    <div class="flex flex-col gap-y-12">
      <Carousel v-for="genre in genres" :key="genre.name" :genre="genre.name" />
    </div>
  </div>
</template>
