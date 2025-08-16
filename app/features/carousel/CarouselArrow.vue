<script setup lang="ts">
const { direction, onClick } = defineProps<{
  direction: "left" | "right";
  onClick: () => void;
}>();

const arrowIcon = computed(() => (direction === "left" ? "‹" : "›"));
const positionClass = computed(() =>
  direction === "left" ? "left-0 bg-black" : "right-0 bg-black"
);
</script>

<template>
  <ClientOnly>
    <button
      @click="onClick"
      :class="['sticky px-6 cursor-pointer', positionClass]"
    >
      <span class="text-7xl text-white">{{ arrowIcon }}</span>
    </button>
  </ClientOnly>
</template>
