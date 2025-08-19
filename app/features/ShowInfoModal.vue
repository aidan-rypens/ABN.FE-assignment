<script setup lang="ts">
import { format, parseISO } from "date-fns";
import type { Show } from "~~/server/types/api.typings";

const { show, isOpen } = defineProps<{
  show: Show | null;
  isOpen: boolean;
}>();

defineEmits<{
  close: [];
}>();

const formatDate = (dateString?: string) => {
  if (!dateString) return "Unknown";
  try {
    return format(parseISO(dateString), "MMMM d, yyyy");
  } catch {
    return "Unknown";
  }
};

const formatRuntime = (runtime?: number) => {
  if (!runtime) return "Unknown";
  return `${runtime} min`;
};
</script>

<template>
  <Modal :is-open="isOpen && !!show" show-mobile-handle @close="$emit('close')">
    <template #header-content>
      <h1 class="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2">
        {{ show?.name }}
      </h1>
      <div
        class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-300"
      >
        <div class="flex items-center gap-x-1">
          <img src="/icons/white-star.svg" alt="star" class="w-4 h-4" />
          <span class="font-medium">{{ show?.rating }}/10</span>
        </div>
        <span>{{ formatDate(show?.premiered) }}</span>
        <span>{{ formatRuntime(show?.runtime) }}</span>
        <span class="capitalize">{{ show?.status.toLowerCase() }}</span>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <div class="lg:col-span-1">
        <div
          class="aspect-[3/4] max-w-xs mx-auto lg:max-w-none lg:mx-0 rounded-xl overflow-hidden bg-neutral-800"
        >
          <img
            v-if="show?.image?.original"
            :src="show.image.original"
            :alt="show.name"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-gray-500 text-sm"
          >
            No image available
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <div class="flex flex-col sm:flex-row gap-3">
          <WatchButton>Watch</WatchButton>
          <Button leadingIcon="/icons/heart.svg">Add to list</Button>
        </div>

        <div v-if="show?.genres.length">
          <h3 class="text-lg font-semibold text-white mb-3">Genres</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="genre in show.genres"
              :key="genre"
              class="px-3 py-1 bg-[#00FFB4]/10 text-[#00FFB4] rounded-full text-sm border border-[#00FFF2]/30"
            >
              {{ genre }}
            </span>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-white mb-3">Summary</h3>
          <p class="text-gray-300 leading-relaxed text-sm md:text-base">
            {{ show?.summary }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-if="show?.network">
            <h4 class="text-md font-semibold text-white mb-2">Network</h4>
            <p class="text-gray-300">{{ show.network.name }}</p>
            <p v-if="show.network.country" class="text-gray-400 text-sm">
              {{ show.network.country.name }}
            </p>
          </div>

          <div>
            <h4 class="text-md font-semibold text-white mb-2">Details</h4>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Language:</span>
                <span class="text-gray-300">{{
                  show?.language || "Unknown"
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Status:</span>
                <span class="text-gray-300 capitalize">{{
                  show?.status.toLowerCase()
                }}</span>
              </div>
              <div v-if="show?.premiered" class="flex justify-between">
                <span class="text-gray-400">Premiered:</span>
                <span class="text-gray-300">{{
                  formatDate(show.premiered)
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>
