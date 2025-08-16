<script setup lang="ts">
import type { Show } from "~~/server/types/api.typings";
import ShowItem from "~/features/ShowItem.vue";
import CarouselArrow from "./CarouselArrow.vue";

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

const {
  data: shows,
  pending,
  error,
} = await useFetch<Show[]>(`/api/shows/${genre}`, {
  query: { limit, sort },
});
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold">{{ genre }}</h2>
    <div class="flex flex-col gap-4">
      <div v-if="pending">Loading...</div>
      <div v-else-if="error">Error: {{ error }}</div>

      <div class="flex gap-x-12 overflow-x-auto h-[25rem]">
        <CarouselArrow direction="left" :onClick="() => {}" />
        <div v-for="show in shows" :key="show.id">
          <ShowItem
            :name="show.name"
            :rating="show.rating"
            :imageSrc="show?.image?.medium"
          />
        </div>
        <CarouselArrow direction="right" :onClick="() => {}" />
      </div>
    </div>
  </div>
</template>
