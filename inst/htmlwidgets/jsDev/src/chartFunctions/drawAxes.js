import trySelect from './trySelect';

export default ({svg, scales, height}) => {
  // Add the axes holders
  const tryG = trySelect(svg, 'g');

  // draw x-axis
  tryG('.x_axis')
    .attr('transform', 'translate(0,0)')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(scales.x).tickFormat(d3.timeFormat('%I %p')));

  // draw y-axis
  tryG('.y_axis').call(d3.axisLeft(scales.y).ticks(5));
};
