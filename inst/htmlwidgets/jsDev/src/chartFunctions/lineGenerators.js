import {area, line} from 'd3';

const lineGen = (scales) => line()
  .x((d) => scales.x(d.x))
  .y((d) => scales.y(d.y));

const areaGen = (scales) =>
  area()
    .curve(d3.curveStepAfter)
    .x((d) => scales.x(d.x))
    .y((d) => scales.y(0))
    .y1((d) => scales.y(d.y));

module.exports = {lineGen, areaGen};
