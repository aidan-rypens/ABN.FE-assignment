<script setup lang="ts">
import type { TVGenreData } from "~~/server/utils/genres";

const {
  data: genres,
  pending,
  error,
} = await useFetch<TVGenreData[]>("/api/shows/genres");
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold">Genres</h2>
    <div v-if="pending">Loading genres...</div>

    <div v-else-if="error">Error loading genres</div>

    <ul v-else-if="genres">
      <li v-for="genre in genres" :key="genre.name">
        {{ genre.name }} ({{ genre.popularity }})
      </li>
    </ul>
  </div>
</template>
