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
import groupTags from './dataFunctions/groupTags';

import DayChart from './DayChart';
import makeTagInput from './chartFunctions/makeTagInput';
import disableBrushes from './chartFunctions/disableBrushes';

import addTagAction from './actions/addTag';
import deleteTagAction from './actions/deleteTag';
import addDataAction from './actions/addData';

/* Takes multiple day's worth of data and spins out a day viz for each along with
*  some tagging logic to go with it.
*/
const VisualizeDays = (config) => {
  const {
    domTarget,
    tagMessage,
    dayHeight = 200,
    width = d3.select(domTarget).style('width'),
    yMax = 200,
    margins = {left: 40, right: 80, top: 60, bottom: 30},
    fontFamily = 'optima',
  } = config;

  // Set up store;
  const store = createStore(mainReducer);

  //// Setting up action emmiters ///////
  const addTag = addTagAction(store);
  const deleteTag = deleteTagAction(store);
  const addData = addDataAction(store);
  
  const sel = d3.select(domTarget);

  const colorScale = colors[9];

  let dayPlots = {};

  // stores all the users tags [{tag, date, start, end}, ...]
  let tags = [];

  // Object to relate a tag to a color for plotting.
  let tagColors = {};

  // set up function to generate a common set of scales for all the days.
  const scalesGen = makeScales(yMax);

  // set up data subseting function using supplied x and y keys
  const dataSubsetter = subsetData({xVal: 'time', yVal: 'value'});

  // set up legend with the standard defaults and then call it.
  const legendGen = TagLegend({sel, fontFamily});
  legendGen(tagColors, tags);

  // // append a hidden div to act as our tagging interface.
  makeTagInput(sel);

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

  // window.addEventListener('resize', () => {
  //   resize();
  // });

  // behavior when we get new data from the server.
  const renderViz = (data, tags = []) => {
    const groupedData = groupData(data);
    const groupedWithTags = groupTags(groupedData, tags);
    const cWidth = width - margins.left - margins.right;
    const cHeight = dayHeight - margins.top - margins.bottom;

    svg
      .style('height', groupedWithTags.length * dayHeight)
      .style('width', width);

    const dayChart = DayChart({
      dataSubsetter,
      scalesGen,
      height: cHeight,
      width: cWidth,
      addTag,
      deleteTag,
    });

    const days = svg.selectAll('.dayViz').data(groupedWithTags, (d) => d.date);

    // ENTER new days
    days
      .enter()
      .append('g')
      .attr('class', 'dayViz')
      .attr('id', (d) => dateToId(d.date))
      .attr('width', width)
      .attr('height', dayHeight)
      .merge(days) // merge with the updating elements too.
      .attr(
        'transform',
        (d, i) => `translate(${margins.left}, ${margins.top + i * dayHeight})`
      )
      .call(function(selection) {
        selection.each(function(d, i) {
          // generate chart here; `d` is the data and `this` is the element
          dayChart(d, this);
        });
      });

    // Remove days no longer present
    days.exit().remove();
    
  };

  // when new data is sent to the vis send action to redux store to add it. 
  const newData = (data) => {
    addData(data);
  };

  store.subscribe(() => {
    
    disableBrushes(''); // kill and brushes that may be open. 
    console.log('running subscribe function');
    const {data, tags} = store.getState();
    renderViz(data, tags);
  });

  return {
    newData,
  };
};

module.exports = VisualizeDays;
