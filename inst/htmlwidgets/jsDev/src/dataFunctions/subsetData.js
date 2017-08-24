import {curry} from 'rambda';
import secondsToTime from '../timeHelpers/secondsToTime';

// Takes a setup object first that shouldnt change througout the whole app lifecycle. 
// It defaults, perhaps unwisely, to transform the x values from a seconds in the day 
// to a javascript time. This is provided as an option so it can be disabled for testing. 
export default curry(
  ({xVal = 'time', yVal = 'value', xTransform = secondsToTime}, type, data) =>
    data.filter((d) => d.type == type).map((d) => ({
      x: xTransform(+d[xVal]),
      y: +d[yVal],
    }))
);
