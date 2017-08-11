// const SingleDay = require('./SingleDay');
// const TagLegend = require('./TagLegend');
const groupByKey = require('./groupByKey');
// const {makeDiv} = require('./chartHelpers');
const {Set1: colors} = require('colorbrewer');
const makeScales = require('./makeScales');

/* Takes multiple day's worth of data and spins out a day viz for each along with
*  some tagging logic to go with it.
*/
const VisualizeDays = (config) => {
  const {
    targetId,
    width = 500,
    dayHeight = 200,
    margins = {left: 40, right: 80, top: 60, bottom: 30},
    fontFamily = 'optima',
    hrColor = 'steelblue',
    stepsColor = 'orangred',
    tagColors = colors[9],
    onNewTag = (tag) => console.log('new tag', tag),
  } = config;

  const sel = d3.select('#' + targetId);

  // generate a common set of scales for all the days.
  const scalesGen = makeScales(margins);
  const scales = scalesGen({dayHeight, width});

  // function that can take raw data and group it in an object keyed by date.
  const groupOnDate = groupByKey('date');

  const seeInside = (selection) =>
    selection.each(function(d, i) {
      console.log(d);
      console.log(this);
      // generate chart here; `d` is the data and `this` is the element
    });

  const addData = (dayData, tags = []) => {
    const groupedData = groupOnDate(dayData);

    // DATA JOIN
    // Join new data with old elements, if any.
    const dayDivs = sel.selectAll('.dayPlotDiv').data(groupedData, (d) => d.date);

    // UPDATE
    // Update old elements as needed.
    // dayDivs

    // ENTER
    dayDivs
      .enter()
      .append('svg')
      .attr('class', 'dayPlotDiv')
      .attr('id', (d) => d.date)
      .attr('width', width)
      .attr('height', dayHeight)
      .append('g')
      .attr('transform', `translate(${margins.left}, ${margins.top})`)
      .call(seeInside);

    // EXIT
    dayDivs.exit().remove();
  };

  return {addData};

  // // stores all the users tags [{tag, date, start, end}, ...]
  // let tags = [];
  // // Object to relate a tag to a color for plotting.
  // let tagColors = {};

  // // append the tag legend
  // const tagLegend = TagLegend({
  //   el: makeDiv({sel, id: 'tag_legend'}),
  //   tagColors,
  //   tags,
  //   fontFamily,
  // });

  // // Sends tags both up to the caller of the function and also down to
  // // each day's individual viz.
  // const sendTags = (lastTag = '') => {
  //   // update the tag legend
  //   tagLegend.update(tagColors, tags);
  //   // send all tags to each day's visualization
  //   dayPlots.forEach((day) => day.updateTags({tags, lastTag}));
  //   // send new tag info up to shiny or wherever calling this function.
  //   tagMessage(tags, tagColors);
  // };

  // // behavior once a tag is made.
  // const onTag = (tag) => {
  //   const tagName = tag.tag;

  //   // have we seen this tag before?
  //   const tagSeen = tagColors.hasOwnProperty(tagName);

  //   // if the tag is new lets assign it a color!
  //   if (!tagSeen) {
  //     tagColors[tagName] = colorScale.shift();
  //   }

  //   // assign a color to the tag
  //   tag.color = tagColors[tagName];

  //   // push it to the big tags list.
  //   tags.push(tag);

  //   console.log(tags);
  //   // Send updates down to vis and up to caller.
  //   sendTags(tagName);
  // };

  // // when user deletes a tag.
  // const onTagDelete = (tag) => {
  //   // remove the deleted tag from array of tags
  //   tags = tags.filter((t) => t !== tag);

  //   // Send updates down to vis and up to caller.
  //   sendTags();
  // };

  // // scan over dates and initialize a new visualization for each day.
  // dayPlots = Object.keys(groupedData).map(
  //   (date) =>
  //     new SingleDay({
  //       data: groupedData[date],
  //       date,
  //       scales,
  //       margins: margins,
  //       height: dayHeight,
  //       width: getContainerWidth(),
  //       sel: makeDiv({sel, id: date}),
  //       onTag,
  //       onTagDelete,
  //       fontFamily,
  //     })
  // );

  // const resize = () =>
  //   dayPlots.forEach((day) =>
  //     day.resize({width: getContainerWidth(), height: dayHeight})
  //   );

  // window.addEventListener('resize', () => {
  //   resize();
  // });

  // return {
  //   resize,
  // };
};

module.exports = VisualizeDays;
