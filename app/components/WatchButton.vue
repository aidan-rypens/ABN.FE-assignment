<script setup lang="ts"></script>

<template>
  <button
    class="bg-gradient-to-r from-[#00FF8D] to-[#00FFF2] text-black px-8 py-3 rounded-xl font-semibold hover:brightness-110 cursor-pointer transition-all flex items-center gap-x-2"
  >
    <img src="/icons/watch.svg" alt="watch" class="w-5 h-5" />
    <slot>Watch</slot>
  </button>
</template>
