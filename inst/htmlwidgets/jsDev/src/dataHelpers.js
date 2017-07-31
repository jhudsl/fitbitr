const d3 = require('d3');

const {
  secondsToTime,
} = require('./timeHelpers');

const subsetData = ({data, type, xVal = 'time', yVal = 'value'}) =>
  data.filter((d) => d.type == type).map((d) => ({
    x: secondsToTime(+d[xVal]),
    y: +d[yVal],
  }));

const groupByDate = (data) =>
  data.reduce((grouped, current) => {
    // check if current date is already in key
    const dateSeen = grouped.hasOwnProperty(current.date);
    // if this is the first time seeing this date, initialize an empty array to push to.
    if (!dateSeen) {
      grouped[current.date] = [];
    }

    // send the whole object through to the outcome.
    grouped[current.date].push(current);

    return grouped;
  }, {});


module.exports = {
  subsetData,
  groupByDate,
};
