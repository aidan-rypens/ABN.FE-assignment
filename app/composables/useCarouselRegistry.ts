interface CarouselState {
  genre: string;
  isLoading: boolean;
  hasShows: boolean;
  error: string | null;
}

const carouselRegistry = ref<Map<string, CarouselState>>(new Map());

export const useCarouselRegistry = () => {
  const registerCarousel = (
    genre: string,
    initialState: Omit<CarouselState, "genre">
  ) => {
    carouselRegistry.value.set(genre, { genre, ...initialState });
  };

  const updateCarousel = (
    genre: string,
    updates: Partial<Omit<CarouselState, "genre">>
  ) => {
    const current = carouselRegistry.value.get(genre);
    if (current) {
      carouselRegistry.value.set(genre, { ...current, ...updates });
    }
  };

  const unregisterCarousel = (genre: string) => {
    carouselRegistry.value.delete(genre);
  };

  const allCarousels = computed(() =>
    Array.from(carouselRegistry.value.values())
  );

  const allCarouselsLoaded = computed(() => {
    const carousels = allCarousels.value;
    return (
      carousels.length > 0 && carousels.every((carousel) => !carousel.isLoading)
    );
  });

  const hasAnyResults = computed(() => {
    return allCarousels.value.some((carousel) => carousel.hasShows);
  });

  const hasNoResults = computed(() => {
    return allCarouselsLoaded.value && !hasAnyResults.value;
  });

  const hasErrors = computed(() => {
    // return true;
    return allCarousels.value.some((carousel) => carousel.error !== null);
  });

  return {
    registerCarousel,
    updateCarousel,
    unregisterCarousel,
    allCarousels: readonly(allCarousels),
    allCarouselsLoaded: readonly(allCarouselsLoaded),
    hasAnyResults: readonly(hasAnyResults),
    hasNoResults: readonly(hasNoResults),
    hasErrors: readonly(hasErrors),
  };
};
