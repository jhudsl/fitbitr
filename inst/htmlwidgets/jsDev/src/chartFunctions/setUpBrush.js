const d3 = require('d3');

// Supplied with a scales object and two callbacks
// one for a valid brush on a day (onBrush) and another
// when the brush action gets called but isn't on this time range.
// takes a brush event from d3 and converts it to a time range [startSecs, endSecs].
// Returns a function that will get plopped into the callback for a d3 brush behavior.
const setUpBrush = ({
  scales,
  width,
  height,
  onBrush,
  onClickOff = () => console.log('off range'),
}) => {
  function brushEvent() {
    try {
      const s = d3.event.selection;
      const timeRange = s.map((t) => scales.toSeconds(t));
      // Behavior when brush extent is valid.
      onBrush(timeRange);
    } catch (err) {
      // When the user has just clicked elsewhere.
      onClickOff();
      console.log(err);
    }
  }

  // set up brushing function.
  return d3
    .brushX()
    .extent([[0, 0], [width, height]])
    .on('brush end', brushEvent);
};

module.exports = setUpBrush;
