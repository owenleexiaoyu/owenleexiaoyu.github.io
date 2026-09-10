(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root && root.document) {
    root.OwenGardenNavigation = api;
    api.install(root);
  }
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";

  var BRAND_LINK_SELECTOR = [
    ".filetree-sidebar > a[href='/']",
    ".navbar .navbar-inner > a[href='/']",
  ].join(",");

  function updateBrandLinks(doc) {
    var links = doc.querySelectorAll(BRAND_LINK_SELECTOR);
    Array.prototype.forEach.call(links, function (link) {
      link.setAttribute("href", "/garden/");
    });
    return links.length;
  }

  function install(win) {
    updateBrandLinks(win.document);
  }

  return {
    BRAND_LINK_SELECTOR: BRAND_LINK_SELECTOR,
    updateBrandLinks: updateBrandLinks,
    install: install,
  };
});
