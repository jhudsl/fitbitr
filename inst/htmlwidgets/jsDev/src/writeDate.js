const moment = require('moment');

const writeDate = ({date, width, height, svg}) => {
  const dateLabel = svg
    .append('g')
    .attr('class', 'current_date')
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('font-size', 20)
    .text(moment(date).format('MMM  DD'));

  // moves the date upon resize.
  const update = ({width, height}) =>
    dateLabel.attr(
      'transform',
      `translate( ${width} , ${height / 2}) rotate(90)`
    );

  // initialize into correct position.
  update({width, height});

  return {update};
};

module.exports = writeDate;
