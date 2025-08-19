<script setup lang="ts">
import Sidebar from "~/features/Sidebar/Sidebar.vue";
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-white font-sans">
    <Sidebar />
    <main class="ml-40">
      <NuxtPage />
    </main>
  </div>
</template>
