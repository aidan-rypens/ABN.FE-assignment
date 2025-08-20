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
    <NuxtImg
      :src="props.imageSrc || '/images/featured.jpg'"
      :alt="props.title"
      class="w-full h-full object-cover"
      fetchpriority="high"
      width="1920"
      height="384"
    />
    <div
      class="absolute inset-0 bg-gradient-to-t from-black via-black/70 via-30% to-transparent"
    />
    <div
      class="absolute left-0 top-0 w-full h-full flex flex-col justify-end p-4 pb-8 md:p-8 text-white max-w-2xl"
    >
      <div class="flex items-center gap-x-1 mb-4">
        <img src="/icons/white-star.svg" alt="star" class="w-4 h-4 pb-0.5" />
        <span class="text-lg font-medium">{{ props.rating }}</span>
      </div>
      <h1 class="text-3xl md:text-5xl font-bold mb-4 line-clamp-3">
        {{ props.title }}
      </h1>
      <p class="text-sm text-gray-200 mb-6 line-clamp-3">
        {{ props.subtitle }}
      </p>
      <div
        class="flex flex-col md:flex-row gap-3 md:gap-x-4 max-w-44 md:max-w-none"
      >
        <WatchButton>Watch</WatchButton>
        <Button leadingIcon="/icons/heart.svg" disabled>Add to list</Button>
      </div>
    </div>
  </div>
</template>
