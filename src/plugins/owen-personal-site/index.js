const fs = require("fs");
const path = require("path");
require("dotenv").config();
const settings = require("../../helpers/constants");
const home = require("./content");
const blog = require("./lib/blog");

function readTemplate(pluginDir, name) {
  return fs.readFileSync(path.join(pluginDir, "templates", name), "utf8");
}

function pageSettings() {
  const resolved = {};
  const pageSettingKeys = [
    ...settings.ALL_NOTE_SETTINGS,
    "dgEnableSearch",
    "dgShowFileTree",
    "dgLinkPreview",
  ];
  for (const key of pageSettingKeys) {
    resolved[key] = process.env[key] === "true";
  }
  resolved.dgShowBacklinks = false;
  resolved.dgShowLocalGraph = false;
  resolved.dgShowToc = false;
  resolved.dgShowInlineTitle = false;
  resolved.dgShowFileTree = false;
  return resolved;
}

function blogPageData(extra = {}) {
  return {
    layout: "layouts/index.njk",
    eleventyExcludeFromCollections: true,
    contentClasses: "owen-blog-page",
    settings: pageSettings(),
    ...extra,
  };
}

module.exports = {
  setupEleventy(eleventyConfig, context) {
    // The core fallback owns `/` when no dg-home note exists. This plugin
    // replaces it while enabled; disabling the plugin restores the fallback.
    eleventyConfig.ignores.add("src/site/index.njk");
    eleventyConfig.ignores.add("src/site/dg-fallback-index-marker.njk");

    eleventyConfig.addCollection("owenBlogPosts", blog.getBlogPosts);
    eleventyConfig.addCollection("owenBlogTags", (collectionApi) =>
      blog.getBlogTags(blog.getBlogPosts(collectionApi))
    );
    eleventyConfig.addCollection("owenBlogRecentUpdated", (collectionApi) =>
      blog.recentUpdated(blog.getBlogPosts(collectionApi))
    );

    eleventyConfig.addFilter("owenBlogExcerpt", blog.excerpt);
    eleventyConfig.addFilter("owenBlogDate", blog.formatDate);
    eleventyConfig.addFilter("owenBlogTagSlug", blog.tagSlug);
    eleventyConfig.addFilter("owenBlogTimeline", blog.timelineGroups);
    eleventyConfig.addFilter("owenBlogVisibleTags", blog.visibleTags);
    eleventyConfig.addFilter("owenBlogTagCount", (items, tag) =>
      (items || []).filter((item) => blog.visibleTags(item).includes(tag)).length
    );

    eleventyConfig.addTemplate(
      "owen-personal-home.njk",
      readTemplate(context.pluginDir, "home.njk"),
      {
        permalink: "/",
        layout: false,
        eleventyExcludeFromCollections: true,
        home,
      }
    );

    eleventyConfig.addTemplate(
      "owen-blog-index.njk",
      readTemplate(context.pluginDir, "blog-index.njk"),
      blogPageData({
        title: "博客",
        pagination: {
          data: "collections.owenBlogPosts",
          size: 10,
          alias: "posts",
        },
        permalink: "/blog/{% if pagination.pageNumber > 0 %}page/{{ pagination.pageNumber + 1 }}/{% endif %}",
        eleventyImport: { collections: ["owenBlogPosts", "owenBlogRecentUpdated"] },
      })
    );

    eleventyConfig.addTemplate(
      "owen-blog-tags.njk",
      readTemplate(context.pluginDir, "blog-tags.njk"),
      blogPageData({
        title: "标签",
        permalink: "/blog/tags/",
        eleventyImport: { collections: ["owenBlogPosts", "owenBlogTags"] },
      })
    );

    eleventyConfig.addTemplate(
      "owen-blog-tag.njk",
      readTemplate(context.pluginDir, "blog-tag.njk"),
      blogPageData({
        title: "标签",
        pagination: {
          data: "collections.owenBlogTags",
          size: 1,
          alias: "blogTag",
        },
        permalink: "/blog/tags/{{ blogTag | owenBlogTagSlug }}/",
        eleventyImport: { collections: ["owenBlogPosts", "owenBlogTags"] },
      })
    );

    eleventyConfig.addTemplate(
      "owen-blog-timeline.njk",
      readTemplate(context.pluginDir, "blog-timeline.njk"),
      blogPageData({
        title: "时间线",
        permalink: "/blog/timeline/",
        eleventyImport: { collections: ["owenBlogPosts"] },
      })
    );
  },
};
