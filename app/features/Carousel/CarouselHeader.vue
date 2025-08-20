<script setup lang="ts">
const { isLoading, genre, canScrollLeft, canScrollRight } = defineProps<{
  isLoading: boolean;
  genre: string;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}>();
</script>

<template>
  <div class="flex justify-between items-center mb-2">
    <h2 class="text-2xl font-bold mb-4">
      <template v-if="isLoading">
        <div class="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
      </template>
      <template v-else>
        {{ genre }}
      </template>
    </h2>
    <div class="flex gap-2">
      <button
        title="Scroll left"
        type="button"
        data-testid="carousel-arrow-left"
        :disabled="!canScrollLeft"
        class="w-10 h-10 flex items-center justify-center rounded-md transition-colors border-[1px] border-[#ffffff1a]"
        :class="
          canScrollLeft
            ? 'bg-gray-700 text-white hover:bg-gray-600 cursor-pointer'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        "
        @click="onScrollLeft"
      >
        <img
          src="/icons/caret-left.svg"
          alt="Scroll left"
          :class="
            canScrollLeft
              ? 'w-4 h-4 brightness-0 invert'
              : 'w-4 h-4 brightness-0 invert opacity-50'
          "
        />
      </button>
      <button
        title="Scroll right"
        type="button"
        data-testid="carousel-arrow-right"
        :disabled="!canScrollRight"
        class="w-10 h-10 flex items-center justify-center rounded-md transition-colors border-[1px] border-[#ffffff1a]"
        :class="
          canScrollRight
            ? 'bg-gray-700 text-white hover:bg-gray-600 cursor-pointer'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        "
        @click="onScrollRight"
      >
        <img
          src="/icons/caret-right.svg"
          alt="Scroll right"
          :class="
            canScrollRight
              ? 'w-4 h-4 brightness-0 invert'
              : 'w-4 h-4 brightness-0 invert opacity-50'
          "
        />
      </button>
    </div>
  </div>
</template>
