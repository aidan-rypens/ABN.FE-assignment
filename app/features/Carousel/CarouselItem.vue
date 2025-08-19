<script setup lang="ts">
import CarouselItemControls from "./CarouselItemControls.vue";
import type { Show } from "~~/server/types/api.typings";

const props = defineProps<{
  name: string;
  rating: number;
  imageSrc?: string;
  isLoading?: boolean;
  show?: Show;
}>();
</script>

<template>
  <div
    class="w-48 h-80 flex flex-col overflow-hidden flex-none cursor-pointer group"
  >
    <template v-if="props.isLoading">
      <div class="animate-pulse flex flex-col h-full">
        <div class="bg-gray-300 rounded w-full h-72 mb-4" />
        <div class="h-6 bg-gray-300 rounded mb-2 w-3/4" />
        <div class="h-4 bg-gray-200 rounded w-1/4" />
      </div>
    </template>
    <template v-else>
      <div class="relative w-full h-full">
        <div class="w-full h-full relative">
          <img
            :src="props.imageSrc"
            :alt="props.name"
            class="w-full h-full object-cover rounded-2xl"
          />
          <div
            class="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/100 via-black/40 to-transparent pointer-events-none"
          />
          <CarouselItemControls :show="props.show" />
        </div>
        <div
          class="absolute bottom-4 left-0 w-full px-3 py-2 flex flex-col gap-y-1"
        >
          <h3 class="text-white font-bold text-lg line-clamp-2">
            {{ props.name }}
          </h3>
          <div v-if="props.rating" class="flex items-center gap-x-1">
            <img
              src="/icons/white-star.svg"
              alt="star"
              class="w-4 h-4 pb-0.5"
            />
            <span>{{ props.rating }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
