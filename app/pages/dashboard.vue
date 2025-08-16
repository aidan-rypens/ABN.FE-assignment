<script setup lang="ts">
import GenreShows from "~/features/GenreShows.vue";

const { data: genres } = await useFetch<TVGenreData[]>("/api/shows/genres");
</script>

<template>
  <h1 class="text-4xl font-bold">Dashboard</h1>
  <div class="flex flex-col gap-y-12">
    <GenreShows
      v-for="genre in genres"
      :key="genre.name"
      :genre="genre.name"
      :limit="10"
    />
  </div>
</template>
