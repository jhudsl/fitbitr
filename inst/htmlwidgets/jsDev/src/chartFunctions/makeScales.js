import {curry} from 'rambda';
import {scaleTime, scaleLinear} from 'd3';
import secondsToTime from '../timeHelpers/secondsToTime';

// returns a scale for x y and to convert to seconds from screen position
// as well as returning a function for recomputing the size dependent components.
const makeScales = curry((margins, yMax, height, width) => {
  const chartWidth = width - margins.left - margins.right;
  const chartHeight = height - margins.top - margins.bottom;

  let x = scaleTime()
    .domain([secondsToTime(0), secondsToTime(86400)])
    .range([0, chartWidth]);
    
  let y = scaleLinear().domain([0, yMax]).range([chartHeight, 0]);

  let toSeconds = scaleLinear().range([0, 86400]).domain([0, chartWidth]);

  return {
    x,
    y,
    toSeconds,
  };
});

module.exports = makeScales;
