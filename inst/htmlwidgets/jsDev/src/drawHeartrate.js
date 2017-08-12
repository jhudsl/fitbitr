const {makeLine} = require('./shapeGenerators');

const drawHeartRate = (config) => {
  const {svg, scales, hrData, hrColor, lineThickness} = config;

  // g containers for the different metrics
  const hrG = svg.append('g').attr('class', 'hr_plot');

  const hrLineGenerator = makeLine(scales);

  // // Draw heart rate line
  // grab the correct g element
  const hrLine = hrG.selectAll('path').data([hrData]);

  // Update existing line
  hrLine.attr('d', hrLineGenerator);

  // ENTER new line
  hrLine
    .enter()
    .append('path')
    .attr('d', hrLineGenerator)
    .style('stroke', hrColor)
    .style('stroke-width', lineThickness)
    .style('fill', 'none');
};

module.exports = drawHeartRate;
