<script setup lang="ts">
import { useCarouselRegistry } from "~/composables/useCarouselRegistry";

const { hasErrors } = useCarouselRegistry();

const letters = [
  { char: "H", color: "#ffb3ba" },
  { char: "i", color: "#ffe0ac" },
  { char: "r", color: "#ffffba" },
  { char: "e", color: "#baffc9" },
  { char: " ", color: "#bae1ff" },
  { char: "t", color: "#e0bbff" },
  { char: "h", color: "#b3ffd9" },
  { char: "i", color: "#ffb3ba" },
  { char: "s", color: "#ffe0ac" },
  { char: " ", color: "#ffffba" },
  { char: "g", color: "#baffc9" },
  { char: "u", color: "#bae1ff" },
  { char: "y", color: "#e0bbff" },
  { char: "!", color: "#b3ffd9" },
];
</script>

<template>
  <aside
    class="hidden md:flex fixed left-0 top-0 h-full w-32 bg-black z-10 flex-col"
    :class="{ 'pt-20': hasErrors }"
  >
    <div class="flex-1 flex flex-col items-center pt-12 gap-y-24">
      <NuxtLink to="/">
        <img src="/icons/logo.svg" alt="Logo" class="w-10 h-10" />
      </NuxtLink>
      <div
        title="Just some placeholder icons"
        class="flex flex-col items-center gap-y-12 cursor-not-allowed"
      >
        <img src="/icons/sidebar/home.svg" alt="Home" class="w-6 h-6" />
        <img
          src="/icons/sidebar/notifications.svg"
          alt="Notifications"
          class="w-6 h-6"
        />
        <img src="/icons/sidebar/heart.svg" alt="Heart" class="w-6 h-6" />
      </div>
    </div>
    <div class="p-4 pb-6 flex flex-col items-center gap-y-4">
      <NuxtLink
        to="https://www.linkedin.com/in/aidanrypens/"
        external
        target="_blank"
        rel="noopener noreferrer"
        class="group hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-y-2"
      >
        <NuxtImg
          src="/images/aidan.jpg"
          alt="Aidan Rypens Profile"
          class="w-14 h-14 rounded-full object-cover mx-auto"
          width="56"
          height="56"
        />
        <span
          class="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 wave-container"
        >
          <span
            v-for="(letter, index) in letters"
            :key="index"
            :style="{
              color: letter.color,
              animationDelay: `${index * 0.1}s`,
            }"
            class="wave-letter"
          >
            {{ letter.char === " " ? "\u00A0" : letter.char }}
          </span>
        </span>
      </NuxtLink>
    </div>
  </aside>
</template>

<style scoped>
@keyframes wave {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.wave-letter {
  display: inline-block;
  animation: wave 1.2s ease-in-out infinite;
}

.wave-container:hover .wave-letter {
  animation-play-state: running;
}
</style>
