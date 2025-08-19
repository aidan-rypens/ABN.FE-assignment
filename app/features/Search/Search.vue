<script setup lang="ts">
import debounce from "lodash.debounce";

const route = useRoute();
const router = useRouter();

const query = ref((route.query.q as string) || "");

const updateURL = debounce((newQuery: string) => {
  const sanitizedQuery = newQuery?.trim();
  router.push({
    query: { ...route.query, q: sanitizedQuery || undefined },
  });
}, 300);

const clearSearch = () => {
  query.value = "";
};

watch(query, updateURL);
</script>

<template>
  <div class="flex items-center gap-x-2 w-full">
    <div class="relative w-full">
      <input
        type="text"
        v-model="query"
        placeholder="Search for a show..."
        class="w-full p-2 pr-10 rounded-md border-neutral-700/50 border-2 text-gray-300 placeholder-gray-300 text-sm"
        maxlength="100"
        aria-label="Search for TV shows"
      />
      <span
        v-if="!query || query.length === 0"
        class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center"
      >
        <img src="/icons/search.svg" alt="search" class="w-5 h-5" />
      </span>
      <button
        v-if="query"
        @click="clearSearch"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 focus:outline-none cursor-pointer"
        aria-label="Clear search"
      >
        ✕
      </button>
    </div>
  </div>
</template>
