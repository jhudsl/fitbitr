const d3 = require('d3');
const secondsToTime = require('./timeFunctions/secondsToTime');
const {curry} = require('ramda');

// returns an object with scales for x y and to convert to seconds from screen position
// curryable function that takes margins as first argument so it can be configured once 
// and then we don't have to continuly pass around afterwards. 
const makeScales = curry(
  (margins, {dayHeight: height, width, yMax = 200}) => {
    // Some true constants so we're not just plugging numbers in.
    const secondsInDay = 86400;
    const chartWidth = width - margins.left - margins.right;
    const chartHeight = height - margins.top - margins.bottom;

    // Set up static parts of the scales.
    const x = d3
      .scaleTime()
      .domain([secondsToTime(0), secondsToTime(secondsInDay)])
      .range([0, chartWidth]);

    const y = d3.scaleLinear().domain([0, yMax]).range([chartHeight, 0]);

    const toSeconds = d3
      .scaleLinear()
      .range([0, secondsInDay])
      .domain([0, chartWidth]);

    return {
      x,
      y,
      toSeconds,
    };
  }
);

module.exports = makeScales;
