const d3 = require('d3');
const {timeFormat} = require('./timeHelpers');

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

  return {
    update,
  };
};

module.exports = drawAxes;
