<script setup lang="ts">
import type { TVGenre } from "~~/server/utils/genres";

const {
  data: genres,
  pending,
  error,
} = await useFetch<TVGenre[]>("/api/shows/genres");
</script>

<template>
  <div>
    <h2>Genres</h2>

    <div v-if="pending">Loading genres...</div>

    <div v-else-if="error">Error loading genres</div>

    <ul v-else-if="genres">
      <li v-for="genre in genres" :key="genre">{{ genre }}</li>
    </ul>
  </div>
</template>
