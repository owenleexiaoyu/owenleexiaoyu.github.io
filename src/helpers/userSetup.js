const { buildTocHtml } = require("./tocNormalized");

function userMarkdownSetup(md) {
  // The md parameter stands for the markdown-it instance used throughout the site generator.
  // Feel free to add any plugin you want here instead of /.eleventy.js
}

function userEleventySetup(eleventyConfig) {
  // Override `toc` from eleventy-plugin-nesting-toc: outline levels are normalized so the
  // shallowest heading in the page is treated as the first outline level (see tocNormalized.js).
  eleventyConfig.addFilter("toc", function (content, opts) {
    if (!content) {
      return "";
    }
    return buildTocHtml(content, {
      tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
      ...(opts || {}),
    });
  });
}

exports.userMarkdownSetup = userMarkdownSetup;
exports.userEleventySetup = userEleventySetup;
