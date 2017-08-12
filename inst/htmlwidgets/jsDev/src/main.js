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
    data,
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

  let dayPlots;

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
    el: makeDiv({sel, id: 'tag_legend'}),
    tagColors,
    tags,
    fontFamily,
  });

  // Sends tags both up to the caller of the function and also down to
  // each day's individual viz.
  const sendTags = (lastTag = '') => {
    // update the tag legend
    tagLegend.update(tagColors, tags);
    // send all tags to each day's visualization
    dayPlots.forEach((day) => day.updateTags({tags, lastTag}));
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
    dayPlots.forEach((day) =>
      day.resize({width: getContainerWidth(), height: dayHeight})
    );

  window.addEventListener('resize', () => {
    resize();
  });

  // behavior when we get new data from the server.
  const newData = (data, tags) => {
    const groupedData = groupByDate(data);

    const uniqueDays = Object.keys(groupedData);

    // DATA JOIN
    const dayDivs = sel.selectAll('.day_viz').data(uniqueDays, (d)=> d);

    // Enter new days
    dayDivs
      .enter()
      .append('div')
      .style('position', 'relative')
      .attr('class', 'day_viz')
      .attr('id', (d) => dateToId(d))
      .html('');

    // Remove days no longer present
    dayDivs.exit().remove();

    // scan over dates and initialize a new visualization for each day.
    dayPlots = Object.keys(groupedData).map((date) =>
      SingleDay({
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
      })
    );
  };

  // kick it off
  newData(data, tags);

  return {
    resize,
    newData,
  };
};

module.exports = VisualizeDays;
