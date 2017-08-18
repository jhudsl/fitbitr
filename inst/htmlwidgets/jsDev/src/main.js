const SingleDay = require('./SingleDay');
const TagLegend = require('./TagLegend');
const {groupByDate} = require('./dataHelpers');
const {makeScales} = require('./chartHelpers');
const makeDiv = require('./chartFunctions/makeDiv');
const {Set1: colors} = require('colorbrewer');
const dateToId = require('./chartFunctions/dateToId');

/* Takes multiple day's worth of data and spins out a day viz for each along with
*  some tagging logic to go with it.
*/
const VisualizeDays = (config) => {
  const {
    domTarget,
    dayHeight = 200,
    dayMargins = {left: 40, right: 80, top: 60, bottom: 30},
    yMax = 200,
    fontFamily = 'optima',
    tagMessage,
  } = config;
  const getContainerWidth = () => sel._groups[0][0].offsetWidth;

  const sel = d3.select(domTarget);
  const colorScale = colors[9];

  let dayPlots = {};

  // stores all the users tags [{tag, date, start, end}, ...]
  let tags = [];

  // Object to relate a tag to a color for plotting.
  let tagColors = {};

  // generate a common set of scales for all the days.
  const scales = makeScales({
    yMax,
    height: dayHeight,
    width: getContainerWidth(),
    margins: dayMargins,
  });

  // append the tag legend

  const tagLegend = TagLegend({
    sel,
    tagColors,
    tags: tags,
    fontFamily,
  });

  // Sends tags both up to the caller of the function and also down to
  // each day's individual viz.
  const sendTags = (lastTag = '') => {
    // update the tag legend
    tagLegend.update(tagColors, tags);
    // send all tags to each day's visualization
    Object.keys(dayPlots).forEach((day) =>
      dayPlots[day].updateTags({tags, lastTag})
    );
    // send new tag info up to shiny or wherever calling this function.
    tagMessage(tags, tagColors);
  };

  // behavior once a tag is made.
  const onTag = (tag) => {
    const tagName = tag.tag;

    // have we seen this tag before?
    const tagSeen = tagColors.hasOwnProperty(tagName);

    // if the tag is new lets assign it a color!
    if (!tagSeen) {
      tagColors[tagName] = colorScale.shift();
    }

    // assign a color to the tag
    tag.color = tagColors[tagName];

    // push it to the big tags list.
    tags.push(tag);

    // Send updates down to vis and up to caller.
    sendTags(tagName);
  };

  // when user deletes a tag.
  const onTagDelete = (tag) => {
    // remove the deleted tag from array of tags
    tags = tags.filter((t) => t !== tag);

    // Send updates down to vis and up to caller.
    sendTags();
  };

  const resize = () =>
    Object.keys(dayPlots).forEach((day) =>
      dayPlots[day].resize({width: getContainerWidth(), height: dayHeight})
    );

  window.addEventListener('resize', () => {
    resize();
  });

  // behavior when we get new data from the server.
  const newData = (data, newTags) => {
    console.log('adding new data');
    const groupedData = groupByDate(data);

    const uniqueDays = Object.keys(groupedData);
    console.log('unique days in new data', uniqueDays);
    // empty holder for dayplots.
    const newDayPlots = {};

    // DATA JOIN
    const dayDivs = sel.selectAll('.day_viz').data(uniqueDays, (d) => d);

    // Enter new days
    dayDivs
      .enter()
      .append('div')
      .style('position', 'relative')
      .attr('class', 'day_viz')
      .attr('id', (d) => dateToId(d))
      .html('')
      .each((date) => {
        // add the plot object to our object keyed by the date.
        dayPlots[dateToId(date)] = SingleDay({
          data: groupedData[date],
          date,
          scales,
          margins: dayMargins,
          height: dayHeight,
          width: getContainerWidth(),
          sel: makeDiv({sel, id: date}),
          onTag,
          onTagDelete,
          fontFamily,
        });
      });

    // Remove days no longer present
    dayDivs.exit().remove();

    // this is a bit complicated and a result of bad planning, but here we create a new 'day plots' object that
    // only has days from the current data in it. This helps the function know what days to map over when doing
    // things like adding tags etc.
    console.log('old dayplots object', dayPlots);
    const currentDayPlots = {};

    Object.keys(dayPlots).forEach((dayId) => {
      console.log('checking this day', dayId);
      const inCurrentData = uniqueDays.map((d) => dateToId(d)).includes(dayId);
      console.log('it is in the current data', inCurrentData);
      if (inCurrentData) {
        currentDayPlots[dayId] = dayPlots[dayId];
      }
    });
    // finally update the dayplots global with this.
    dayPlots = currentDayPlots;
    console.log('new dayplots object', dayPlots);

    // update the tags storage. If new tags argument is left blank we simply keep old tags.
    tags = newTags ? newTags : tags;
    // send message to all the days to update.
    sendTags();
  };

  // // kick it off
  // newData(data, tags);

  return {
    resize,
    newData,
  };
};

console.log("hi")

module.exports = VisualizeDays;
