<script setup lang="ts">
import { useCarouselRegistry } from "~/composables/useCarouselRegistry";

const { hasErrors } = useCarouselRegistry();
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
        <img
          src="/images/aidan.jpg"
          alt="Aidan Rypens Profile"
          class="w-14 h-14 rounded-full object-cover mx-auto"
        />
        <span
          class="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 animate-bounce"
        >
          <span style="color: #ffb3ba">h</span>
          <span style="color: #ffe0ac">i</span>
          <span style="color: #ffffba">r</span>
          <span style="color: #baffc9">e</span>
          <span style="color: #bae1ff">&nbsp;</span>
          <span style="color: #e0bbff">t</span>
          <span style="color: #b3ffd9">h</span>
          <span style="color: #ffb3ba">i</span>
          <span style="color: #ffe0ac">s</span>
          <span style="color: #ffffba">&nbsp;</span>
          <span style="color: #baffc9">g</span>
          <span style="color: #bae1ff">u</span>
          <span style="color: #e0bbff">y</span>
          <span style="color: #b3ffd9">!</span>
        </span>
      </NuxtLink>
    </div>
  </aside>
</template>
