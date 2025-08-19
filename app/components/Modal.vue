<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  maxWidth?: string;
  showMobileHandle?: boolean;
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
        v-if="isOpen"
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
            :class="[
              'bg-neutral-900 rounded-t-3xl md:rounded-2xl min-h-[85vh] max-h-[85vh] md:min-h-0 md:max-h-[90vh] w-full overflow-hidden border-t border-neutral-700/50 md:border md:border-neutral-700/50 fixed inset-x-0 bottom-0 md:relative md:inset-auto flex flex-col md:my-auto',
              maxWidth || 'md:max-w-4xl',
            ]"
          >
            <div
              v-if="showMobileHandle"
              class="md:hidden flex justify-center pt-2 pb-1 flex-shrink-0"
            >
              <div class="w-12 h-1 bg-neutral-600 rounded-full"></div>
            </div>

            <slot name="header">
              <div
                class="flex-shrink-0 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-700/50 p-4 md:p-6"
              >
                <div class="flex justify-between items-start gap-4">
                  <div class="flex-1 min-w-0">
                    <slot name="header-content"></slot>
                  </div>
                  <button
                    @click="handleClose"
                    class="text-gray-400 hover:text-white transition-colors p-2 hover:bg-neutral-800 rounded-full flex-shrink-0 cursor-pointer"
                    aria-label="Close modal"
                  >
                    <img
                      title="Close"
                      src="/icons/close.svg"
                      alt="close"
                      class="w-6 h-6"
                    />
                  </button>
                </div>
              </div>
            </slot>

            <div class="flex-1 overflow-y-auto min-h-0">
              <div class="p-4 md:p-6">
                <slot></slot>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
