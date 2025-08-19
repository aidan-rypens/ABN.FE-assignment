<script setup lang="ts">
import Sidebar from "~/features/Sidebar/Sidebar.vue";
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-white font-sans">
    <Sidebar />
    <main class="md:ml-40">
      <NuxtPage />
    </main>
    <footer class="px-8 text-center text-gray-400 text-sm py-8">
      <p>
        This is a demo project for a technical interview. The data is sourced
        from the TV Maze API.
      </p>
    </footer>
  </div>
</template>
