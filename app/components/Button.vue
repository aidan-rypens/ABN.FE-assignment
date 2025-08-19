<script setup lang="ts">
const { leadingIcon, disabled } = defineProps<{
  leadingIcon?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <button
    :class="[
      'px-8 py-3 rounded-xl font-semibold flex items-center gap-x-2 transition-colors',
      disabled
        ? 'cursor-not-allowed opacity-60 bg-gray-400 text-gray-600'
        : 'cursor-pointer bg-white text-black hover:bg-gray-200',
    ]"
    :disabled="disabled"
    :title="disabled ? 'Not implemented' : undefined"
  >
    <img
      v-if="leadingIcon"
      :src="leadingIcon"
      :alt="leadingIcon.split('/').pop()?.split('.')[0] || 'icon'"
      class="w-5 h-5"
      :class="{ 'opacity-50': disabled }"
    />
    <slot>Button</slot>
  </button>
</template>
