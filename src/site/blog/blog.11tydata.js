require("dotenv").config();
const settings = require("../../helpers/constants");

const allSettings = settings.ALL_NOTE_SETTINGS;

module.exports = {
  layout: "layouts/blog.njk",
  eleventyExcludeFromCollections: true,
  eleventyComputed: {
    settings: () => {
      const noteSettings = {};
      allSettings.forEach((setting) => {
        const globalSetting = process.env[setting];
        noteSettings[setting] = globalSetting === "true";
      });
      return noteSettings;
    },
  },
};
