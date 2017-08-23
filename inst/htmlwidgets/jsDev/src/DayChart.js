import {curry} from 'rambda';
import * as d3 from 'd3';

import trySelect from './chartFunctions/trySelect';
import drawAxes from './chartFunctions/drawAxes';
import writeDate from './chartFunctions/writeDate';
import drawLine from './chartFunctions/drawLine';
import drawTags from './chartFunctions/drawTags';
import {lineGen, areaGen} from './chartFunctions/lineGenerators';
import disableBrushes from './chartFunctions/disableBrushes';
import editTagInput from './chartFunctions/editTagInput';
import resetBrushes from './chartFunctions/resetBrushes';

const hideInput = () => d3.select('#tagInput').style('display', 'none');

// import addTag from './actions/addTag';

/* Takes a bunch of self explanatory variables, but mostly the data as a json file and the date 
 * @param {Array} data - This is an array of objects with keys "hr", "steps", and "time".
 * @param {String} date - String of the date in MM-DD-YYYY format. 
 * @param {Object} scales - Object housing three d3 scales: x, y, and toSeconds
 * @param {Object} margins - Follows the standard d3 margin conventions. Gives padding on each side of chart. 
 * @param {Number} [height = 200] - height isn pixels of the days plot
 * @param {Number} [width = 1000] - Width in pixels of days plot
 * @param {Number} [lineThickness = 1] - Plot line thickness. 
 * @param {String} [hrColor = '#8da0cb'] - Hex code for heartrate line color
 * @param {String} [stepsColor = '#66c2a5'] - Hex code for steps bar color.
 * @param {String} [fontFamily = 'avenir'] - Valid css name for a font for axes. 
*/
export default curry((config, {date, data, tags}, selection) => {
  const {
    dataSubsetter,
    scalesGen,
    height,
    width,
    addTag,
    deleteTag,
    tagColors,
    lineThickness = 1,
    hrColor = '#8da0cb',
    stepsColor = '#66c2a5',
    fontFamily = 'avenir',
  } = config;

  const svg = d3.select(selection);
  let scales = scalesGen(height, width);
  const hrData = dataSubsetter('heart rate', data);
  const stepsData = dataSubsetter('steps', data);

  const tryG = trySelect(svg, 'g');

  const hrG = tryG('.hr_plot');
  const stepsG = tryG('.steps_plot');

  drawAxes({svg, scales, height});
  writeDate({width, height}, svg, date);

  // HR line
  drawLine({
    gEl: hrG,
    lineGen: lineGen(scales),
    lineData: hrData,
  })
    .style('stroke', hrColor)
    .style('stroke-width', lineThickness)
    .style('fill', 'none');

  // steps line
  drawLine({
    gEl: stepsG,
    lineGen: areaGen(scales),
    lineData: stepsData,
  })
    .style('fill', stepsColor)
    .style('fill-opacity', 0.5);

  const onBrush = function() {
    try {
      const rangeInSeconds = d3.event.selection.map((pos) =>
        scales.toSeconds(pos)
      );

      // kill all the brushes on other dates
      disableBrushes(date);

      // move input
      moveInput(rangeInSeconds, d3.event.sourceEvent);
    } catch (e) {
      hideInput();
    }
  };

  const brushG = svg.append('g').attr('class', 'brush ' + date);
  const brush = d3
    .brushX()
    .extent([[0, 0], [width, height]])
    .on('start brush end', onBrush);

  const brushReset = resetBrushes(brushG, brush);

  brushG.call(brush);

  const onTagDelete = (tag) => {
    console.log('deleting', tag);
    deleteTag(tag);
    hideInput();
    brushReset();
  };

  drawTags({svg, scales, height, onTagDelete, tagColors}, tags);

  const moveInput = editTagInput({
    type: 'move',
    date,
    addTag,
    hideInput,
    brushReset,
  });
});
