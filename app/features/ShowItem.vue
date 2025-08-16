<script setup lang="ts">
defineProps<{
  name: string;
  rating: number;
  imageSrc?: string;
}>();
</script>

<template>
  <div class="w-48 h-96 flex flex-col overflow-hidden">
    <h3>{{ name }} ⭐{{ rating }}</h3>
    <img :src="imageSrc" :alt="name" class="w-full h-full object-cover" />
  </div>
</template>
