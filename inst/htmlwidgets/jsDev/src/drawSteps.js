const {makeArea} = require('./shapeGenerators');

const drawSteps = (config) => {
  const {svg, scales, stepsData, stepsColor} = config;

  // g containers for the different metrics
  const stepsG = svg.append('g').attr('class', 'steps_plot');

  const stepsAreaGenerator = makeArea(scales);
  // // Draw steps line
  const stepLine = stepsG.selectAll('path').data([stepsData]);

  // Update existing line
  stepLine.attr('d', stepsAreaGenerator);

  // ENTER new line
  stepLine
    .enter()
    .append('path')
    .attr('d', stepsAreaGenerator)
    .style('fill', stepsColor)
    .style('fill-opacity', 0.5);
};

module.exports = drawSteps;
