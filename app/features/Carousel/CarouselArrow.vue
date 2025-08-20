<script setup lang="ts">
const { direction, onClick } = defineProps<{
  direction: "left" | "right";
  onClick: () => void;
}>();

const arrowIcon = computed(() => (direction === "left" ? "‹" : "›"));
const positionClass = computed(() =>
  direction === "left"
    ? "left-0 bg-gradient-to-r from-black from-60% via-black/70 via-80% to-transparent"
    : "right-0 bg-gradient-to-l from-black from-60% via-black/70 via-80% to-transparent"
);
</script>

<template>
  <ClientOnly>
    <button
      @click="onClick"
      :class="[
        'absolute top-0 bottom-0 px-6 cursor-pointer w-24 z-10',
        'opacity-0 hover:opacity-100 transition-opacity duration-300',
        'flex items-center justify-center',
        'hidden lg:flex',
        positionClass,
      ]"
    >
      <span
        class="text-7xl text-white hover:scale-110 transition-transform duration-200"
      >
        {{ arrowIcon }}
      </span>
    </button>
  </ClientOnly>
</template>
