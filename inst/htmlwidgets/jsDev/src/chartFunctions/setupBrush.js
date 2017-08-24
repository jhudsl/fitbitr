import * as d3 from 'd3';

export default ({svg, width, height, onBrush}) => {
  const brush = d3
    .brushX()
    .extent([[0, 0], [width, height]])
    .on('start brush end', onBrush);

  return svg.append('g').attr('class', 'brush').call(brush);
};
 // NOT CURRENTLY USED