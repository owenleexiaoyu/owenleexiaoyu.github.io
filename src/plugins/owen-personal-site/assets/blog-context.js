(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root && root.document) {
    root.OwenBlogContext = api;
    api.install(root);
  }
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";

  var STORAGE_KEY = "owen:blog-view";

  function cleanPath(pathname) {
    return String(pathname || "/").replace(/\/+$/, "") || "/";
  }

  function isGardenPath(pathname) {
    return cleanPath(pathname) === "/garden";
  }

  function isBlogPath(pathname) {
    var path = cleanPath(pathname);
    return path === "/blog" || path.indexOf("/blog/") === 0;
  }

  function shouldCarryContext(pathname) {
    var path = cleanPath(pathname);
    if (path === "/" || path === "/404" || isBlogPath(path) || isGardenPath(path)) {
      return false;
    }
    return !/\.[a-z0-9]{2,8}$/i.test(path);
  }

  function withBlogContext(href, base) {
    var url = new URL(href, base);
    if (!shouldCarryContext(url.pathname)) return href;
    url.searchParams.set("view", "blog");
    return url.pathname + url.search + url.hash;
  }

  function clear(win) {
    try {
      win.sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {}
    win.document.documentElement.classList.remove("dg-blog-view");
  }

  function install(win) {
    win.document.addEventListener("click", function (event) {
      if (!win.document.documentElement.classList.contains("dg-blog-view")) return;
      var anchor = event.target.closest && event.target.closest("a[href]");
      if (!anchor || anchor.hasAttribute("download")) return;

      var rawHref = anchor.getAttribute("href");
      if (!rawHref || rawHref.charAt(0) === "#") return;

      var url;
      try {
        url = new URL(anchor.href, win.location.href);
      } catch (error) {
        return;
      }
      if (url.origin !== win.location.origin) return;

      if (isGardenPath(url.pathname)) {
        clear(win);
        return;
      }

      if (shouldCarryContext(url.pathname)) {
        anchor.href = withBlogContext(url.href, win.location.href);
      }
    });
  }

  return {
    STORAGE_KEY: STORAGE_KEY,
    cleanPath: cleanPath,
    isBlogPath: isBlogPath,
    isGardenPath: isGardenPath,
    shouldCarryContext: shouldCarryContext,
    withBlogContext: withBlogContext,
    clear: clear,
    install: install,
  };
});
