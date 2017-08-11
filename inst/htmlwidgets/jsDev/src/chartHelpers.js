const d3 = require('d3');

const {secondsToTime, timeFormat, toMonthDay} = require('./timeHelpers');

// Appends an svg to a div and provides a function for resizing it.
const setUpSVG = (config) => {
  const {sel, width, height, margins} = config;

  // draw svg to screen
  const svg = sel
    .append('svg')
    .style('user-select', 'none')
    .style('cursor', 'default');

  const svgG = svg.append('g').attr('class', 'viz_container');

  // function to change size of svg
  const resizeSvg = ({width, height}) => {
    svg.attr('width', width).attr('height', height);

    svgG.attr(
      'transform',
      'translate(' + margins.left + ',' + margins.top + ')'
    );
  };

  // initialize svg with passed sizes.
  resizeSvg({width, height});

  // returns svg selection and also the resize function.
  return {
    svg: svgG,
    resizeSvg,
  };
};

const drawAxes = ({svg, scales, height}) => {
  // Add the axes holders
  const xAxis = svg.append('g').attr('class', 'x_axis');
  const yAxis = svg.append('g').attr('class', 'y_axis');

  const update = ({scales, height}) => {
    xAxis
      .attr('transform', 'translate(0,0)')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(scales.x).tickFormat(timeFormat));

    yAxis.call(d3.axisLeft(scales.y).ticks(5));
  };

  // run update axis once to initialize:
  update({scales, height});

  // // givem a better font
  // svg.selectAll('.tick text').attr('font-family', fontFamily);

  return {
    update,
  };
};

const makeLine = (scales) =>
  d3.area().x((d) => scales.x(d.x)).y((d) => scales.y(d.y));

const makeArea = (scales) =>
  d3
    .area()
    .curve(d3.curveStepAfter)
    .x((d) => scales.x(d.x))
    .y((d) => scales.y(0))
    .y1((d) => scales.y(d.y));

// The default -s in the dates cant be used as ids in html.
const dateToId = (date) => `date_${date.replace(/-/g, '_')}`;

const makeDiv = ({sel, id}) => {
  sel
    .append('div')
    .style('position', 'relative')
    .attr('id', dateToId(id))
    .html('');

  return d3.select('#' + dateToId(id));
};

// Easy d3 transition maker. 
// giving the transition a name avoids conflicts
const trans = (name = 'sliding', speed = 500) => d3.transition(name)
  .duration(speed);


module.exports = {
  setUpSVG,
  makeScales,
  drawAxes,
  makeLine,
  makeArea,
  writeDate,
  dateToId,
  makeDiv,
  trans,
};
