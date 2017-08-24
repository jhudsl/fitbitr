import TagLegend from './Tagger/TagLegend';
import dateToId from './chartFunctions/dateToId';

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
    yMax = 200,
    margins = {left: 40, right: 80, top: 60, bottom: 30},
    fontFamily = 'optima',
    tagMessage,
  } = config;

  console.log('hi');

  let {dayHeight = 200, width = d3.select(domTarget).style('width')} = config;

  // Set up store;
  const store = createStore(mainReducer);

  // // Setting up action emmiters ///////
  const addTag = addTagAction(store);
  const deleteTag = deleteTagAction(store);
  const addData = addDataAction(store);

  const sel = d3.select(domTarget);

  // set up function to generate a common set of scales for all the days.
  const scalesGen = makeScales(yMax);

  // set up data subseting function using supplied x and y keys
  const dataSubsetter = subsetData({xVal: 'time', yVal: 'value'});

  // set up legend with the standard defaults and then call it.
  const legendGen = TagLegend({sel, fontFamily});
  legendGen({}, []);

  // // append a hidden div to act as our tagging interface.
  makeTagInput(sel);

  const svg = sel.append('svg').attr('id', 'dayViz');

  // behavior when we get new data from the server.
  const renderViz = (data, tags, tagColors) => {
    const groupedData = groupData(data);
    const groupedWithTags = groupTags(groupedData, tags);
    const cWidth = width - margins.left - margins.right;
    const cHeight = dayHeight - margins.top - margins.bottom;

    legendGen(tagColors, tags);

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
      tagColors,
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

  const rerender = (resize = false) => {
    disableBrushes(''); // kill and brushes that may be open.
    const {data, tags, tagColors} = store.getState();
    if (resize) renderViz(data, [], tagColors);
    // rerender viz with new tags or data
    renderViz(data, tags, tagColors);
    // send tags to shiny 
    tagMessage(tags);
  };

  const resize = (newWidth, newHeight = dayHeight) => {
    width = newWidth;
    dayHeight = newHeight;
    rerender(true);
  };

  store.subscribe(() => {
    rerender();
  });

  return {
    newData,
    resize,
  };
};

module.exports = VisualizeDays;
