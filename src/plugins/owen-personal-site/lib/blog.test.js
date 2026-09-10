import { describe, expect, it } from "vitest";
import {
  excerpt,
  getBlogPosts,
  getBlogTags,
  isPublishedBlogPost,
  tagSlug,
  timelineGroups,
} from "./blog.js";

function post(url, data = {}, content = "") {
  return { url, data, templateContent: content, date: new Date("2020-01-01") };
}

describe("personal site blog data", () => {
  it("uses every published note except the garden entry", () => {
    const garden = post("/garden/", { "dg-publish": true });
    const publicNote = post("/notes/public/", { "dg-publish": true });
    const privateNote = post("/notes/private/", { "dg-publish": false });

    expect(isPublishedBlogPost(garden)).toBe(false);
    expect(isPublishedBlogPost(publicNote)).toBe(true);
    expect(isPublishedBlogPost(privateNote)).toBe(false);
  });

  it("sorts posts by created date and falls back to updated", () => {
    const items = [
      post("/older/", { "dg-publish": true, created: "2024-01-01" }),
      post("/newer/", { "dg-publish": true, updated: "2025-02-01" }),
    ];
    const collectionApi = { getFilteredByTag: () => items };
    expect(getBlogPosts(collectionApi).map((item) => item.url)).toEqual([
      "/newer/",
      "/older/",
    ]);
  });

  it("strips markup, truncates excerpts, and ignores system tags", () => {
    expect(excerpt("<p>Hello <strong>garden</strong></p>", 8)).toBe("Hello ga…");
    const items = [post("/a/", { tags: ["note", "Kotlin", "随笔"] })];
    expect(new Set(getBlogTags(items))).toEqual(new Set(["Kotlin", "随笔"]));
  });

  it("creates stable non-empty slugs for CJK tags", () => {
    expect(tagSlug("Kotlin")).toBe("kotlin");
    expect(tagSlug("随笔")).toMatch(/^t-[a-f0-9]{12}$/);
    expect(tagSlug("随笔")).toBe(tagSlug("随笔"));
  });

  it("groups posts by descending year and month", () => {
    const groups = timelineGroups([
      post("/a/", { created: "2024-03-01" }),
      post("/b/", { created: "2025-01-01" }),
      post("/c/", { created: "2024-12-01" }),
    ]);
    expect(groups.map((group) => group.year)).toEqual([2025, 2024]);
    expect(groups[1].months.map((month) => month.month)).toEqual([12, 3]);
  });
});
