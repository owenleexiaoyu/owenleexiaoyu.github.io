const crypto = require("crypto");
const slugify = require("@sindresorhus/slugify");

const GARDEN_URL = "/garden/";
const SYSTEM_TAGS = new Set(["gardenEntry", "note"]);

function parseTime(value) {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function publishedDate(item) {
  return item?.data?.created || item?.data?.updated || item?.date;
}

function updatedDate(item) {
  return item?.data?.updated || item?.data?.created || item?.date;
}

function isPublishedBlogPost(item) {
  return Boolean(
    item &&
      item.data &&
      item.data["dg-publish"] === true &&
      item.url !== GARDEN_URL
  );
}

function getBlogPosts(collectionApi) {
  return collectionApi
    .getFilteredByTag("note")
    .filter(isPublishedBlogPost)
    .sort((a, b) => parseTime(publishedDate(b)) - parseTime(publishedDate(a)));
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function excerpt(html, length = 200) {
  const text = stripHtml(html);
  const limit = Number.isFinite(Number(length)) ? Number(length) : 200;
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
}

function visibleTags(item) {
  return (item?.data?.tags || []).filter((tag) => tag && !SYSTEM_TAGS.has(tag));
}

function getBlogTags(items) {
  const tags = new Set();
  for (const item of items || []) {
    for (const tag of visibleTags(item)) tags.add(tag);
  }
  return [...tags].sort((a, b) => a.localeCompare(b, "zh-CN"));
}

function tagSlug(tag) {
  const text = String(tag || "");
  const result = slugify(text);
  if (result) return result;
  if (!text) return "untitled";
  return `t-${crypto.createHash("sha256").update(text, "utf8").digest("hex").slice(0, 12)}`;
}

function formatDate(input) {
  const value = input && typeof input === "object" && input.data
    ? publishedDate(input)
    : input;
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function timelineGroups(items) {
  const years = new Map();
  for (const item of items || []) {
    const date = new Date(publishedDate(item));
    if (Number.isNaN(date.getTime())) continue;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    if (!years.has(year)) years.set(year, new Map());
    const months = years.get(year);
    if (!months.has(month)) months.set(month, []);
    months.get(month).push(item);
  }

  return [...years.keys()]
    .sort((a, b) => b - a)
    .map((year) => ({
      year,
      months: [...years.get(year).keys()]
        .sort((a, b) => b - a)
        .map((month) => ({
          month,
          monthLabel: `${month} 月`,
          posts: years
            .get(year)
            .get(month)
            .slice()
            .sort((a, b) => parseTime(publishedDate(b)) - parseTime(publishedDate(a))),
        })),
    }));
}

function recentUpdated(items, count = 8) {
  return (items || [])
    .slice()
    .sort((a, b) => parseTime(updatedDate(b)) - parseTime(updatedDate(a)))
    .slice(0, count);
}

module.exports = {
  GARDEN_URL,
  excerpt,
  formatDate,
  getBlogPosts,
  getBlogTags,
  isPublishedBlogPost,
  recentUpdated,
  stripHtml,
  tagSlug,
  timelineGroups,
  visibleTags,
};
