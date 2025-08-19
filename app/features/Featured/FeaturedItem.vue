<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle: string;
  rating: number;
  imageSrc?: string;
}>();
</script>

<template>
  <div class="relative w-full h-96 overflow-hidden rounded-2xl">
    <img
      :src="props.imageSrc || '/images/featured.jpg'"
      :alt="props.title"
      class="w-full h-full object-cover"
    />
    <div
      class="absolute inset-0 bg-gradient-to-t from-black via-black/70 via-30% to-transparent"
    />
    <div class="absolute bottom-8 left-8 text-white max-w-2xl">
      <div class="flex items-center gap-x-1 mb-4">
        <img src="/icons/white-star.svg" alt="star" class="w-4 h-4 pb-0.5" />
        <span class="text-lg font-medium">{{ props.rating }}</span>
      </div>
      <h1 class="text-5xl font-bold mb-4">{{ props.title }}</h1>
      <p class="text-sm text-gray-200 mb-6 line-clamp-3">
        {{ props.subtitle }}
      </p>
      <div class="flex gap-x-4">
        <button
          class="bg-gradient-to-r cursor-pointer from-[#00FF8D] to-[#00FFF2] text-black px-8 py-3 rounded-xl font-semibold hover:brightness-110 transition-colors flex items-center gap-x-2"
        >
          <img src="/icons/watch.svg" alt="watch" class="w-5 h-5" />
          Watch
        </button>
        <button
          class="cursor-pointer bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
        >
          Add to list
        </button>
      </div>
    </div>
  </div>
</template>
