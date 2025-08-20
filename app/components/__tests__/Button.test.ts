import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Button from "../Button.vue";

describe("Button", () => {
  it("renders with default slot content", () => {
    const wrapper = mount(Button, {
      slots: {
        default: "Click me",
      },
    });

    expect(wrapper.text()).toBe("Click me");
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it('renders with default "Button" text when no slot provided', () => {
    const wrapper = mount(Button);

    expect(wrapper.text()).toBe("Button");
  });

  it("applies correct classes when enabled", () => {
    const wrapper = mount(Button);
    const button = wrapper.find("button");

    expect(button.classes()).toContain("cursor-pointer");
    expect(button.classes()).toContain("bg-white");
    expect(button.classes()).toContain("text-black");
    expect(button.classes()).not.toContain("cursor-not-allowed");
    expect(button.classes()).not.toContain("opacity-60");
  });

  it("applies correct classes and attributes when disabled", () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
    });
    const button = wrapper.find("button");

    expect(button.classes()).toContain("cursor-not-allowed");
    expect(button.classes()).toContain("opacity-60");
    expect(button.classes()).toContain("bg-gray-400");
    expect(button.classes()).toContain("text-gray-600");
    expect(button.attributes("disabled")).toBeDefined();
    expect(button.attributes("title")).toBe("Not implemented");
  });

  it("renders leading icon when provided", () => {
    const iconSrc = "/icons/heart.svg";
    const wrapper = mount(Button, {
      props: {
        leadingIcon: iconSrc,
      },
    });

    const icon = wrapper.find("img");
    expect(icon.exists()).toBe(true);
    expect(icon.attributes("src")).toBe(iconSrc);
    expect(icon.attributes("alt")).toBe("heart");
    expect(icon.classes()).toContain("w-5");
    expect(icon.classes()).toContain("h-5");
  });

  it("does not render icon when leadingIcon is not provided", () => {
    const wrapper = mount(Button);

    expect(wrapper.find("img").exists()).toBe(false);
  });

  it("generates correct alt text from icon path", () => {
    const testCases = [
      { path: "/icons/heart.svg", expected: "heart" },
      { path: "/icons/close.svg", expected: "close" },
      { path: "/complex/path/to/icon.png", expected: "icon" },
    ];

    testCases.forEach(({ path, expected }) => {
      const wrapper = mount(Button, {
        props: {
          leadingIcon: path,
        },
      });

      expect(wrapper.find("img").attributes("alt")).toBe(expected);
    });
  });

  describe("accessibility", () => {
    it("has proper button role by default", () => {
      const wrapper = mount(Button);
      const button = wrapper.find("button");

      expect(button.element.tagName).toBe("BUTTON");
    });

    it("provides descriptive title when disabled", () => {
      const wrapper = mount(Button, {
        props: {
          disabled: true,
        },
      });
      const button = wrapper.find("button");

      expect(button.attributes("title")).toBe("Not implemented");
    });

    it("does not have title attribute when enabled", () => {
      const wrapper = mount(Button);
      const button = wrapper.find("button");

      expect(button.attributes("title")).toBeUndefined();
    });

    it("provides meaningful alt text for icons", () => {
      const wrapper = mount(Button, {
        props: {
          leadingIcon: "/icons/heart.svg",
        },
      });
      const icon = wrapper.find("img");

      expect(icon.attributes("alt")).toBe("heart");
      expect(icon.attributes("alt")).not.toBe("");
    });
  });

  describe("interactions", () => {
    it("emits click event when clicked and enabled", async () => {
      const wrapper = mount(Button);
      const button = wrapper.find("button");

      await button.trigger("click");

      expect(wrapper.emitted("click")).toBeTruthy();
      expect(wrapper.emitted("click")).toHaveLength(1);
    });

    it("can be clicked multiple times when enabled", async () => {
      const wrapper = mount(Button);
      const button = wrapper.find("button");

      await button.trigger("click");
      await button.trigger("click");
      await button.trigger("click");

      expect(wrapper.emitted("click")).toHaveLength(3);
    });

    it("handles keyboard interactions", async () => {
      const wrapper = mount(Button);
      const button = wrapper.find("button");

      await button.trigger("keydown.enter");
      expect(wrapper.emitted("keydown")).toBeTruthy();

      await button.trigger("keydown.space");
      expect(wrapper.emitted("keydown")).toBeTruthy();
    });
  });
});
