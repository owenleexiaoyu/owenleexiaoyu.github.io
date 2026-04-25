/**
 * Table of contents with "root-relative" heading levels: the shallowest heading
 * in the document is treated as outline level 1, so an article that only uses
 * ### / #### still shows those as top-level items in the TOC.
 * Based on eleventy-plugin-nesting-toc/toc.js (MIT), with virtual level mapping.
 */
const cheerio = require("cheerio");

const ignoreAttribute = "data-toc-exclude";

const defaults = {
  tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
  ignoredElements: [],
};

function getParent(prev, current) {
  if (current.level > prev.level) {
    return prev;
  }
  if (current.level === prev.level) {
    return prev.parent;
  }
  return getParent(prev.parent, current);
}

class Item {
  constructor($el, virtualLevel) {
    if ($el && $el.length) {
      this.slug = $el.attr("id");
      this.text = $el.text().trim();
      this.level = virtualLevel;
    } else {
      this.level = 0;
    }
    this.children = [];
  }

  html() {
    let markup = "";
    if (this.slug && this.text) {
      markup += `
                    <li><a href="#${this.slug}">${this.text}</a>
            `;
    }
    if (this.children.length > 0) {
      markup += `
                <ol>
                    ${this.children.map((item) => item.html()).join("\n")}
                </ol>
            `;
    }

    if (this.slug && this.text) {
      markup += "\t\t</li>";
    }

    return markup;
  }
}

function buildTocHtml(htmlstring, options = {}) {
  const opts = { ...defaults, ...options };
  const selector = opts.tags.join(",");

  const root = new Item();
  root.parent = root;

  const $ = cheerio.load(htmlstring || "");
  let headings = $(selector).filter("[id]").filter(`:not([${ignoreAttribute}])`);

  const ignoredElementsSelector = (opts.ignoredElements || []).join(",");
  if (ignoredElementsSelector) {
    headings.find(ignoredElementsSelector).remove();
  }

  if (!headings.length) {
    return "";
  }

  const levelList = [];
  headings.each((_, heading) => {
    const tag = String(heading.tagName).toLowerCase();
    levelList.push(parseInt(tag.slice(1), 10));
  });
  const minLevel = Math.min(...levelList);

  let previous = root;
  headings.each((_, heading) => {
    const $h = $(heading);
    const tag = String(heading.tagName).toLowerCase();
    const realLevel = parseInt(tag.slice(1), 10);
    const virtualLevel = realLevel - minLevel + 1;
    const current = new Item($h, virtualLevel);
    const parent = getParent(previous, current);
    current.parent = parent;
    parent.children.push(current);
    previous = current;
  });

  if (!root.children.length) {
    return "";
  }

  return `<ol class="dg-toc-root">${root.children.map((c) => c.html()).join("\n")}</ol>`;
}

module.exports = { buildTocHtml };
