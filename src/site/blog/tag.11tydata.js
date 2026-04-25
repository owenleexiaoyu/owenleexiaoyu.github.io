module.exports = {
  eleventyComputed: {
    title: (data) => (data.tag != null ? `标签：${data.tag}` : "标签"),
  },
};
