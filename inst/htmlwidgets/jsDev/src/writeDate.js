const writeDate = ({date, margins, width, height, svg, fontFamily}) => {
  const dateLabel = svg
    .append('g')
    .attr('class', 'current_date')
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('font-family', fontFamily)
    .attr('font-size', 20)
    .text(toMonthDay(date));

  // moves the date upon resize.
  const update = ({width, height}) =>
    dateLabel.attr(
      'transform',
      `translate( ${(width - margins.right*1.2)} , ${((height - margins.top) / 2)}) rotate(90)`
    );

  // initialize into correct position.
  update({width, height});

  return {update};
};

module.exports = writeDate;
