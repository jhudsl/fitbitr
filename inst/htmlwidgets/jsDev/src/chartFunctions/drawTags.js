import trySelect from './trySelect';
import secondsToTime from '../timeHelpers/secondsToTime';
import trans from './transition';

const barThickness = 20;
// const {trans} = require('./chartHelpers');

/* Is supplied with a svg object and some config options and then exposes 
 *  a way of plotting tagged events when supplied with an array of tags. 
 */
export default (config, tags) => {
  const {svg, scales, height, onTagDelete} = config;

  const secToPlot = (secs) => scales.x(secondsToTime(secs));

  const tagBars = trySelect(svg, 'g', '.tagsContainer')
    .selectAll('rect')
    .data(tags, (t) => t);

  tagBars
    .enter()
    .append('g')
    .attr('class', 'tag')
    .attr('transform', (d) => `translate(${secToPlot(d.start)},0)`)
    .on('mouseenter', onMouseover)
    .on('mouseleave', onMouseout)
    .append('rect')
    .attr('class', 'tag_bar')
    .style('fill-opacity', '0.5')
    .attr('y', height)
    .attr('rx', barThickness * 0.5)
    .attr('ry', barThickness * 0.5)
    .attr('height', barThickness)
    .attr('width', 1e-6)
    .style('fill', (d) => 'blue')
    .transition(trans('barEnter', 500))
    .attr('width', (d) => secToPlot(d.end) - secToPlot(d.start));
  // .merge(tagBars) // merge with the updating elements too.
  // // .attr()
  // .style('fill', (d) => 'blue')
  // .attr('width', (d) => secToPlot(d.end) - secToPlot(d.start));

  // //Remove days no longer present
  tagBars.exit().remove();

  //   /** Behavior when individual tag is moused over */
  function onMouseover(selectedTag) {
    const buttonRadius = barThickness * 0.5;

    // append delete button
    const deleteButton = d3
      .select(this)
      .append('g')
      .attr('class', 'delete_button')
      .attr(
        'transform',
        (d) => `translate(${buttonRadius},${height + buttonRadius})`
      )
      .attr('opacity', 1e-6)
      .on('click', onTagDelete);

    const deleteCircle = deleteButton
      .append('circle')
      .attr('r', buttonRadius)
      .attr('fill', 'grey');

    const deleteX = deleteButton
      .append('text')
      .attr('text-anchor', 'middle')
      .style('stroke', '#f0f0f0')
      .attr('dominant-baseline', 'central')
      .text('X');

    deleteButton.transition(trans('expanding')).attr('opacity', 1);
  }

  /** Behavior when individual tag is moused off */
  function onMouseout(selectedTag) {
    d3
      .select(this)
      .select('.delete_button')
      .transition(trans('expanding'))
      .attr('opacity', 1e-6)
      .remove();
  }
};
