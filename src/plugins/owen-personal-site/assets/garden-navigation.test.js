import { describe, expect, it, vi } from "vitest";
import navigation from "./garden-navigation.js";

describe("garden navigation", () => {
  it("points every Digital Garden brand link at the garden entry", () => {
    const first = { setAttribute: vi.fn() };
    const second = { setAttribute: vi.fn() };
    const querySelectorAll = vi.fn(() => [first, second]);

    expect(navigation.updateBrandLinks({ querySelectorAll })).toBe(2);
    expect(querySelectorAll).toHaveBeenCalledWith(navigation.BRAND_LINK_SELECTOR);
    expect(first.setAttribute).toHaveBeenCalledWith("href", "/garden/");
    expect(second.setAttribute).toHaveBeenCalledWith("href", "/garden/");
  });
});
