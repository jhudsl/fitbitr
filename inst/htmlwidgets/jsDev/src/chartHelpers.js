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

// returns a scale for x y and to convert to seconds from screen position
// as well as returning a function for recomputing the size dependent components.
const makeScales = ({yMax, height, width, margins}) => {
  // Set up static parts of the scales.
  let x = d3.scaleTime().domain([secondsToTime(0), secondsToTime(86400)]);
  let y = d3.scaleLinear().domain([0, yMax]);
  let toSeconds = d3.scaleLinear().range([0, 86400]);

  const resizeScales = ({width, height}) => {
    const chartWidth = width - margins.left - margins.right;
    const chartHeight = height - margins.top - margins.bottom;

    // Based on the supplied sizes,
    // assign the range to x and y and domain to seconds
    x.range([0, chartWidth]);
    y.range([chartHeight, 0]);
    toSeconds.domain([0, chartWidth]);
  };

  // Size scales for initial use.
  resizeScales({width, height});

  return {
    x,
    y,
    toSeconds,
    resizeScales,
  };
};

const drawAxes = ({svg, scales, height, margins, fontFamily}) => {
  // Add the axes holders
  const xAxis = svg.append('g').attr('class', 'x_axis');
  const yAxis = svg.append('g').attr('class', 'y_axis');

  const update = ({scales, height}) => {
    xAxis
      .attr('transform', 'translate(0,0)')
      .attr('transform', 'translate(0,' +
        (height - margins.top - margins.bottom) + ')')
      .call(d3.axisBottom(scales.x).tickFormat(timeFormat));

    yAxis.call(d3.axisLeft(scales.y).ticks(5));
  };

  // run update axis once to initialize:
  update({scales, height});

  // givem a better font
  svg.selectAll('.tick text').attr('font-family', fontFamily);

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

const writeDate = ({date, margins, width, height, svg, fontFamily}) => {
  const dateLabel = svg
    .append('g')
    .attr('class', 'current_date')
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('font-family', fontFamily)
    .attr('font-size', 20)
    .text(toMonthDay(date));

  // moves the date upon resize.
  const update = ({width, height}) =>
    dateLabel.attr(
      'transform',
      'translate(' + (width - margins.right*1.2) +
        ',' + ((height - margins.top) / 2) + ') rotate(90)'
    );

  // initialize into correct position.
  update({width, height});

  return {update};
};

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
