import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Search from "../Search.vue";

const mockPush = vi.fn();

vi.mock("vue-router", () => ({
  useRoute: () => ({ query: {} }),
  useRouter: () => ({ push: mockPush }),
}));

const searchInput = '[data-testid="search-input"]';
const clearSearchButton = '[data-testid="clear-search-button"]';

describe("Search", () => {
  it("renders the search input", () => {
    const wrapper = mount(Search);
    const input = wrapper.find(searchInput);

    expect(input.exists()).toBe(true);
    expect(input.attributes("placeholder")).toBe("Search for a show...");
  });

  it("updates the URL when the input changes", async () => {
    vi.useFakeTimers();

    const wrapper = mount(Search);
    const input = wrapper.find(searchInput);

    await input.setValue("Breaking Bad");
    vi.advanceTimersByTime(300);

    expect(mockPush).toHaveBeenCalledWith({
      query: { q: "Breaking Bad" },
    });

    vi.useRealTimers();
  });

  it("clears the search when the clear button is clicked", async () => {
    vi.useFakeTimers();
    const wrapper = mount(Search);
    const input = wrapper.find(searchInput);

    await input.setValue("Breaking Bad");
    expect(mockPush).toHaveBeenCalledWith({
      query: { q: "Breaking Bad" },
    });

    mockPush.mockClear();

    const clearButton = wrapper.find(clearSearchButton);
    await clearButton.trigger("click");
    vi.advanceTimersByTime(300);

    expect(mockPush).toHaveBeenCalledWith({
      query: { q: undefined },
    });
  });
});
