const d3 = require('d3');
const dateToId = require('./dateToId');

const makeDiv = ({sel, id}) => {
  const divId = '#' + dateToId(id);
  const dayDiv = d3.select(divId);

  if (dayDiv.empty()) {
    sel
      .append('div')
      .style('position', 'relative')
      .attr('class', 'day_viz')
      .attr('id', dateToId(id))
      .html('');

    return d3.select(divId);
  }

  return dayDiv;
};

module.exports = makeDiv;
