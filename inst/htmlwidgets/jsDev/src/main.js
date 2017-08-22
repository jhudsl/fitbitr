const SingleDay = require('./SingleDay');
const TagLegend = require('./Tagger/TagLegend');
const {groupByDate} = require('./dataHelpers');

const makeDiv = require('./chartFunctions/makeDiv');
const {Set1: colors} = require('colorbrewer');
const dateToId = require('./chartFunctions/dateToId');

import {createStore} from 'redux';
import mainReducer from './reducers/index';

import makeScales from './chartFunctions/makeScales';
import subsetData from './dataFunctions/subsetData';
import groupData from './dataFunctions/groupData';

import DayChart from './DayChart';

/* Takes multiple day's worth of data and spins out a day viz for each along with
*  some tagging logic to go with it.
*/
const VisualizeDays = (config) => {
  const {
    domTarget,
    tagMessage,
    dayHeight = 200,
    width = 500,
    yMax = 200,
    margins = {left: 40, right: 80, top: 60, bottom: 30},
    fontFamily = 'optima',
  } = config;
  const getContainerWidth = () => sel._groups[0][0].offsetWidth;

  // Set up store;
  const store = createStore(mainReducer);
  store.subscribe(() =>
    console.log('running subscribed function!', store.getState())
  );

  const sel = d3.select(domTarget);

  const colorScale = colors[9];

  let dayPlots = {};

  // stores all the users tags [{tag, date, start, end}, ...]
  let tags = [];

  // Object to relate a tag to a color for plotting.
  let tagColors = {};

  // set up function to generate a common set of scales for all the days.
  const scalesGen = makeScales(margins, yMax);

  // set up data subseting function using supplied x and y keys
  const dataSubsetter = subsetData({xVal: 'time', yVal: 'value'});

  // set up legend with the standard defaults and then call it.
  const legendGen = TagLegend({sel, fontFamily});
  legendGen(tagColors, tags);

  const svg = sel.append('svg').attr('id', 'dayViz');

  // Sends tags both up to the caller of the function and also down to
  // each day's individual viz.
  const sendTags = (lastTag = '') => {
    // update the tag legend
    legendGen(tagColors, tags);
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
    const groupedData = groupData(data);
    const cWidth = width - margins.left - margins.right;
    const cHeight = dayHeight - margins.top - margins.bottom; 

    console.log(groupedData);

    const dayChart = DayChart({
      dataSubsetter,
      scalesGen,
      height: cHeight,
      width: cWidth,
      store,
    });

    const days = svg.selectAll('.dayViz').data(groupedData, (d) => d.date);

    // ENTER new days
    days
      .enter()
      .append('g')
      .attr('class', 'day_viz')
      .attr('id', (d) => dateToId(d.date))
      .attr('width', width)
      .attr('height', dayHeight)
      .attr('transform', `translate(${margins.left}, ${margins.top})`)
      .call(function(selection) {
        selection.each(function(d, i) {
          // generate chart here; `d` is the data and `this` is the element
          dayChart(d, this);
        });
      });

    // // empty holder for dayplots.
    // const newDayPlots = {};

    // // DATA JOIN
    // const dayDivs = sel.selectAll('.day_viz').data(uniqueDays, (d) => d);

    // // Enter new days
    // dayDivs
    //   .enter()
    //   .append('div')
    //   .style('position', 'relative')
    //   .attr('class', 'day_viz')
    //   .attr('id', (d) => dateToId(d))
    //   .html('')
    //   .each((date) => {
    //     console.log('looping through at', date)
    //     // add the plot object to our object keyed by the date.
    //     dayPlots[dateToId(date)] = SingleDay({
    //       data: groupedData[date],
    //       dataSubsetter,
    //       date,
    //       scalesGen,
    //       margins: dayMargins,
    //       height: dayHeight,
    //       width: getContainerWidth(),
    //       sel: makeDiv({sel, id: date}),
    //       onTag,
    //       onTagDelete,
    //       fontFamily,
    //       store,
    //     });
    //   });

    // // Remove days no longer present
    // dayDivs.exit().remove();

    // // this is a bit complicated and a result of bad planning, but here we create a new 'day plots' object that
    // // only has days from the current data in it. This helps the function know what days to map over when doing
    // // things like adding tags etc.
    // const currentDayPlots = {};

    // Object.keys(dayPlots).forEach((dayId) => {
    //   const inCurrentData = uniqueDays.map((d) => dateToId(d)).includes(dayId);
    //   if (inCurrentData) {
    //     currentDayPlots[dayId] = dayPlots[dayId];
    //   }
    // });
    // // finally update the dayplots global with this.
    // dayPlots = currentDayPlots;

    // // update the tags storage. If new tags argument is left blank we simply keep old tags.
    // tags = newTags ? newTags : tags;
    // // send message to all the days to update.
    // sendTags();
  };

  return {
    resize,
    newData,
  };
};

module.exports = VisualizeDays;
