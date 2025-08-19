<script setup lang="ts">
import { useCarouselRegistry } from "~/composables/useCarouselRegistry";

const { hasErrors } = useCarouselRegistry();
</script>

<template>
  <div
    class="fixed top-0 left-0 bg-red-500 w-full py-6 mx-auto flex items-center justify-center z-50"
    v-if="hasErrors"
  >
    We are experiencing some issues with the TV Maze API. Please try again
    later.
  </div>
</template>
