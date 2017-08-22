import {curry} from 'rambda';
import {scaleTime, scaleLinear} from 'd3';
import secondsToTime from '../timeHelpers/secondsToTime';

// returns a scale for x y and to convert to seconds from screen position
// as well as returning a function for recomputing the size dependent components.
// the height and width are post margins convention.
const makeScales = curry((yMax, height, width) => {
  let x = scaleTime()
    .domain([secondsToTime(0), secondsToTime(86400)])
    .range([0, width]);

  let y = scaleLinear().domain([0, yMax]).range([height, 0]);

  let toSeconds = scaleLinear().range([0, 86400]).domain([0, width]);

  return {
    x,
    y,
    toSeconds,
  };
});

module.exports = makeScales;
