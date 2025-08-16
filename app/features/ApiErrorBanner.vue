<script setup lang="ts">
const { error } = await useFetch("/api/health");
const isHealthy = computed(() => error.value?.statusCode !== 503);
</script>

<template>
  <div
    class="bg-yellow-300 w-full py-6 mx-auto flex items-center justify-center"
    v-if="!isHealthy"
  >
    We are experiencing some issues with the TV Maze API. Please try again.
    later.
  </div>
</template>
