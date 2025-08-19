<script setup lang="ts">
import ShowInfoModal from "../ShowInfoModal.vue";
import type { Show } from "~~/server/types/api.typings";

const props = defineProps<{
  show?: Show;
}>();

const isModalOpen = ref(false);

const openModal = (event: MouseEvent) => {
  event.stopPropagation();
  if (props.show) {
    isModalOpen.value = true;
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
  <div
    class="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
    @click="openModal"
  >
    <div
      class="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30 hover:bg-white/30 hover:scale-110 transition-all duration-200"
    >
      <span
        class="text-white font-bold text-lg select-none"
        @click.stop.prevent="() => {}"
        >PLAY</span
      >
    </div>
    <div class="absolute top-3 right-3">
      <button
        @click="openModal"
        class="w-8 h-8 bg-neutral-800/90 backdrop-blur-sm rounded-full border border-neutral-600/50 hover:bg-neutral-700/90 hover:border-neutral-500/60 transition-all duration-200 flex items-center justify-center group/info cursor-pointer"
        :disabled="!show"
        aria-label="Show info"
      >
        <img
          src="/icons/info.svg"
          alt="info"
          class="w-4 h-4 opacity-70 group-hover/info:opacity-100 transition-opacity duration-200"
        />
      </button>
    </div>

    <ShowInfoModal
      :show="show ?? null"
      :isOpen="isModalOpen"
      @close="closeModal"
    />
  </div>
</template>
