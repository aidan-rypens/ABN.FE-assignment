import ApiErrorBanner from "../ApiErrorBanner.vue";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";

const mockRegistry = {
  hasErrors: ref(false),
};

vi.mock("~/composables/useCarouselRegistry", () => ({
  useCarouselRegistry: () => mockRegistry,
}));

describe("ApiErrorBanner", () => {
  beforeEach(() => {
    mockRegistry.hasErrors.value = false;
  });

  it("does not render when hasErrors is false", () => {
    const wrapper = mount(ApiErrorBanner);

    expect(wrapper.find("[data-testid='api-error-banner']").exists()).toBe(
      false
    );
    expect(wrapper.text()).toBe("");
  });

  it("renders banner when hasErrors is true", () => {
    mockRegistry.hasErrors.value = true;

    const wrapper = mount(ApiErrorBanner);

    expect(wrapper.find("[data-testid='api-error-banner']").exists()).toBe(
      true
    );
    expect(wrapper.text()).toContain(
      "We are experiencing some issues with the TV Maze API"
    );
  });
});
