export default (groupedDays, tags) =>
  groupedDays.map((date) => {
    const dayTags = tags.filter((tag) => tag.date == date.date);
    return {
      date: date.date,
      data: date.data,
      tags: dayTags,
    };
  });
