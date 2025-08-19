<script setup lang="ts">
import { format, parseISO } from "date-fns";
import type { Show } from "~~/server/types/api.typings";

const props = defineProps<{
  show: Show | null;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const handleClose = () => {
  emit("close");
};

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    handleClose();
  }
};

onMounted(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" && props.isOpen) {
      handleClose();
    }
  };
  document.addEventListener("keydown", handleEscape);

  onUnmounted(() => {
    document.removeEventListener("keydown", handleEscape);
  });
});

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);

const formatDate = (dateString?: string) => {
  if (!dateString) return "Unknown";
  try {
    return format(parseISO(dateString), "MMMM d, yyyy");
  } catch {
    return "Unknown";
  }
};

const formatRuntime = (runtime?: number) => {
  if (!runtime) return "Unknown";
  return `${runtime} min`;
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen && show"
        class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 md:p-4 overflow-y-auto"
        @click="handleBackdropClick"
      >
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-full md:scale-95 md:translate-y-4"
          enter-to-class="opacity-100 translate-y-0 md:scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0 md:scale-100"
          leave-to-class="opacity-0 translate-y-full md:scale-95 md:translate-y-4"
        >
          <div
            v-if="isOpen"
            class="bg-neutral-900 rounded-t-3xl md:rounded-2xl min-h-[85vh] max-h-[85vh] md:min-h-0 md:max-h-[90vh] w-full md:max-w-4xl overflow-hidden border-t border-neutral-700/50 md:border md:border-neutral-700/50 fixed inset-x-0 bottom-0 md:relative md:inset-auto flex flex-col md:my-auto"
          >
            <div class="md:hidden flex justify-center pt-2 pb-1 flex-shrink-0">
              <div class="w-12 h-1 bg-neutral-600 rounded-full"></div>
            </div>
            <div
              class="flex-shrink-0 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-700/50 p-4 md:p-6"
            >
              <div class="flex justify-between items-start gap-4">
                <div class="flex-1 min-w-0">
                  <h1
                    class="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2"
                  >
                    {{ show.name }}
                  </h1>
                  <div
                    class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-300"
                  >
                    <div class="flex items-center gap-x-1">
                      <img
                        src="/icons/white-star.svg"
                        alt="star"
                        class="w-4 h-4"
                      />
                      <span class="text-yellow-400 font-medium"
                        >{{ show.rating }}/10</span
                      >
                    </div>
                    <span>{{ formatDate(show.premiered) }}</span>
                    <span>{{ formatRuntime(show.runtime) }}</span>
                    <span class="capitalize">{{
                      show.status.toLowerCase()
                    }}</span>
                  </div>
                </div>
                <button
                  @click="handleClose"
                  class="text-gray-400 hover:text-white transition-colors p-2 hover:bg-neutral-800 rounded-full flex-shrink-0"
                  aria-label="Close modal"
                >
                  <img src="/icons/close.svg" alt="close" class="w-6 h-6" />
                </button>
              </div>
            </div>

            <div class="flex-1 overflow-y-auto min-h-0">
              <div class="p-4 md:p-6">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                  <div class="lg:col-span-1">
                    <div
                      class="aspect-[3/4] max-w-xs mx-auto lg:max-w-none lg:mx-0 rounded-xl overflow-hidden bg-neutral-800"
                    >
                      <img
                        v-if="show.image?.original"
                        :src="show.image.original"
                        :alt="show.name"
                        class="w-full h-full object-cover"
                      />
                      <div
                        v-else
                        class="w-full h-full flex items-center justify-center text-gray-500 text-sm"
                      >
                        No image available
                      </div>
                    </div>
                  </div>

                  <div class="lg:col-span-2 space-y-6">
                    <div class="flex flex-col sm:flex-row gap-3">
                      <WatchButton>Watch</WatchButton>
                      <Button leadingIcon="/icons/heart.svg"
                        >Add to list</Button
                      >
                    </div>
                    <div v-if="show.genres.length > 0">
                      <h3 class="text-lg font-semibold text-white mb-3">
                        Genres
                      </h3>
                      <div class="flex flex-wrap gap-2">
                        <span
                          v-for="genre in show.genres"
                          :key="genre"
                          class="px-3 py-1 bg-[#00FFB4]/10 text-[#00FFB4] rounded-full text-sm border border-[#00FFF2]/30"
                        >
                          {{ genre }}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 class="text-lg font-semibold text-white mb-3">
                        Summary
                      </h3>
                      <p
                        class="text-gray-300 leading-relaxed text-sm md:text-base"
                      >
                        {{ show.summary }}
                      </p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div v-if="show.network">
                        <h4 class="text-md font-semibold text-white mb-2">
                          Network
                        </h4>
                        <p class="text-gray-300">{{ show.network.name }}</p>
                        <p
                          v-if="show.network.country"
                          class="text-gray-400 text-sm"
                        >
                          {{ show.network.country.name }}
                        </p>
                      </div>

                      <div>
                        <h4 class="text-md font-semibold text-white mb-2">
                          Details
                        </h4>
                        <div class="space-y-1 text-sm">
                          <div class="flex justify-between">
                            <span class="text-gray-400">Language:</span>
                            <span class="text-gray-300">{{
                              show.language || "Unknown"
                            }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-400">Status:</span>
                            <span class="text-gray-300 capitalize">{{
                              show.status.toLowerCase()
                            }}</span>
                          </div>
                          <div
                            v-if="show.premiered"
                            class="flex justify-between"
                          >
                            <span class="text-gray-400">Premiered:</span>
                            <span class="text-gray-300">{{
                              show.premiered
                            }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
