const d3 = require('d3');

const makeLine = (scales) =>
  d3.area().x((d) => scales.x(d.x)).y((d) => scales.y(d.y));

const makeArea = (scales) =>
  d3
    .area()
    .curve(d3.curveStepAfter)
    .x((d) => scales.x(d.x))
    .y((d) => scales.y(0))
    .y1((d) => scales.y(d.y));

module.exports = {
  makeLine,
  makeArea,
};
