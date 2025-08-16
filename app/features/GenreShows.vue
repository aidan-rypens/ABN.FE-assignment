<script setup lang="ts">
import type { Show } from "~~/server/types/api.typings";

interface Props {
  genre?: string;
  limit?: number;
  sort?: "rating" | "name" | "premiered";
}

const props = withDefaults(defineProps<Props>(), {
  limit: 10,
  sort: "rating",
});

const {
  data: shows,
  pending,
  error,
} = await useFetch<Show[]>(`/api/shows/${props.genre}`, {
  query: { limit: props.limit, sort: props.sort },
});
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold">{{ genre }}</h2>
    <div class="flex flex-col gap-4">
      <div v-if="pending">Loading...</div>
      <div v-else-if="error">Error: {{ error }}</div>
      <div class="flex gap-x-12">
        <div v-for="show in shows" :key="show.id">
          <h3>{{ show.name }} ⭐{{ show.rating }}</h3>
          <img :src="show?.image?.medium" :alt="show.name" />
        </div>
      </div>
    </div>
  </div>
</template>
