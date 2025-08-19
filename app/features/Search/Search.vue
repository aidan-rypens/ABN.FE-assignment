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
        placeholder="Search for a show"
        class="w-full p-2 pr-10 rounded-md border border-gray-300"
        maxlength="100"
        aria-label="Search for TV shows"
      />
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
