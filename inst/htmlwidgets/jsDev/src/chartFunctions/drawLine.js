export default ({gEl, lineGen, lineData}) => {
  // grab the correct g element
  const pathEl = gEl.selectAll('path').data([lineData], (d) => d);

  // Update existing line
  pathEl.attr('d', lineGen);

  // ENTER new line
  pathEl.enter().append('path').attr('d', lineGen);

  // Exit old
  pathEl.exit().remove();

  return gEl.selectAll('path');
};
