<script setup lang="ts">
const props = defineProps<{
  leadingIcon?: string;
}>();
</script>

<template>
  <button
    class="cursor-pointer px-8 py-3 rounded-xl font-semibold flex items-center gap-x-2 transition-colors bg-white text-black hover:bg-gray-200"
  >
    <img
      v-if="leadingIcon"
      :src="leadingIcon"
      :alt="leadingIcon.split('/').pop()?.split('.')[0] || 'icon'"
      class="w-5 h-5"
    />
    <slot>Button</slot>
  </button>
</template>
