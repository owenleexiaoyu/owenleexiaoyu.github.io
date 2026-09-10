import { describe, expect, it, vi } from "vitest";
import context from "./blog-context.js";

describe("blog browsing context", () => {
  it("adds a one-time marker to note links and preserves query/hash", () => {
    expect(
      context.withBlogContext(
        "/HaiShu/Kotlin/?q=one#title",
        "https://example.com/blog/"
      )
    ).toBe("/HaiShu/Kotlin/?q=one&view=blog#title");
  });

  it("does not mark blog, garden, root, or asset links", () => {
    expect(context.shouldCarryContext("/blog/tags/")).toBe(false);
    expect(context.shouldCarryContext("/garden/")).toBe(false);
    expect(context.shouldCarryContext("/")).toBe(false);
    expect(context.shouldCarryContext("/styles/site.css")).toBe(false);
  });

  it("clears session and the document class when entering the garden", () => {
    const remove = vi.fn();
    const classRemove = vi.fn();
    context.clear({
      sessionStorage: { removeItem: remove },
      document: { documentElement: { classList: { remove: classRemove } } },
    });
    expect(remove).toHaveBeenCalledWith(context.STORAGE_KEY);
    expect(classRemove).toHaveBeenCalledWith("dg-blog-view");
  });
});
