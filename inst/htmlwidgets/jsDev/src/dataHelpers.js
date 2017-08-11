const d3 = require('d3');

const {
  secondsToTime,
} = require('./timeHelpers');

const subsetData = ({data, type, xVal = 'time', yVal = 'value'}) =>
  data.filter((d) => d.type == type).map((d) => ({
    x: secondsToTime(+d[xVal]),
    y: +d[yVal],
  }));


module.exports = {
  subsetData,
  groupByDate,
};
