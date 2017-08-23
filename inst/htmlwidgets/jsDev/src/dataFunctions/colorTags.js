export default (tags, tagColors) =>
  tags.map(tag => {
    return {
      color: tagColors[tag.tag],
      ...tag
    };
  });
