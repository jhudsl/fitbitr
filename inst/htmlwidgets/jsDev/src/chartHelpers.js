const d3 = require('d3');

// Easy d3 transition maker.
// giving the transition a name avoids conflicts
const trans = (name = 'sliding', speed = 500) =>
  d3.transition(name).duration(speed);

module.exports = {
  trans,
};
