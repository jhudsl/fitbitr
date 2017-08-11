const {curry, pipe, map} = require('ramda');
const d3 = require('d3');

// [obj] -> Obj of arrays.

// uses a Ramda.js's append function to add new data to end of current data.
// if this is the first time and the current data is non-defined, simply returns an array with the new data.
// no if statement!
const groupByKey = curry((key, data) =>
  pipe(
    d3.nest().key((d) => d[key]).entries,
    map((entry) => ({
      [key]: entry.key,
      data: entry.values,
    }))
  )(data)
);

module.exports = groupByKey;
