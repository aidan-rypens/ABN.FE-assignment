<script setup lang="ts">
const props = defineProps<{
  name: string;
  rating: number;
  imageSrc?: string;
  isLoading?: boolean;
}>();
</script>

<template>
  <div class="w-48 h-96 flex flex-col overflow-hidden flex-none">
    <template v-if="props.isLoading">
      <div class="animate-pulse flex flex-col h-full">
        <div class="bg-gray-300 rounded w-full h-72 mb-4"></div>
        <div class="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </template>
    <template v-else>
      <h3>{{ props.name }} ⭐{{ props.rating }}</h3>
      <img
        :src="props.imageSrc"
        :alt="props.name"
        class="w-full h-full object-cover"
      />
    </template>
  </div>
</template>
