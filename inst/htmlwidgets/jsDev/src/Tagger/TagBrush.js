const d3 = require('d3');

/** Attaches to a single day and initializes a 2d brush on it.
 * Containers helpers to allow for ease of enabling and disabling the brushes
 */
const TagBrush = (config) => {
  const {
    svg,
    width,
    height,
    scales,
    onBrush,
    onClickOff,
  } = config;

  // Have we disabled this brush due to another brush being open?
  let {allowBrush = true} = config;

  /** What happens on brushing */
  function brushBehavior() {
    // if the brush selection is a region
    try {
      const s = d3.event.selection;
      const timeRange = s.map((t) => scales.toSeconds(t));
      // Behavior when brush extent is valid.
      onBrush(timeRange);
    } catch (err) {
      // When the user has just clicked elsewhere.
      onClickOff();
    }
  }
  // set up brushing function.
  const brush = d3
    .brushX()
    .extent([[0, 0], [width, height]])
    .on('brush end', brushBehavior);

  // append a container for the brush and call the brush function on it.
  svg.append('g').attr('class', 'brush').call(brush);

  // Switch on brush
  const turnOn = () => (allowBrush = true);

  // disable brush
  const turnOff = () => (allowBrush = false);

  return {
    turnOn,
    turnOff,
  };
};

module.exports = TagBrush;
