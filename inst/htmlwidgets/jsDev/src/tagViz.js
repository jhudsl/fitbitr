const {secondsToTime} = require('./timeHelpers');
const {trans} = require('./chartHelpers');

/* Is supplied with a svg object and some config options and then exposes 
 *  a way of plotting tagged events when supplied with an array of tags. 
 */

const TagViz = (config) => {
  const {svg, scales, height, barThickness = 25, transitionSpeed = 400, onTagDelete = (tag) => console.log(tag)} = config;

  const tagG = svg.append('g').attr('class', 'tags_container');

  // this is an ugly concatnation of functions I use a bit.
  const secToPlot = (secs) => scales.x(secondsToTime(secs));

  const expandBar = (tag) => tag
      .select('rect')
      .transition(trans('expanding'))
      .style('fill-opacity', 0.85)
      .attr('height', 3*barThickness)
      .attr('y', height - 2*barThickness);

  const shrinkBar = (tag) => tag
      .select('rect')
      .transition(trans('shrinking'))
      .style('fill-opacity', 0.5)
      .attr('height', barThickness)
      .attr('y', height);
      
  /** Behavior when individual tag is moused over */
  function onMouseover(selectedTag) {
    const buttonRadius = barThickness * 0.5;

    // append delete button
    const deleteButton = d3.select(this)
      .append('g')
      .attr('class', 'delete_button')
      .attr(
        'transform',
        (d) => `translate(${buttonRadius},${height + buttonRadius})`
      )
      .attr('opacity', 1e-6)
      .on('click', onTagDelete );

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

    deleteButton
      .transition(trans('expanding'))
      .attr('opacity', 1);
  };

  /** Behavior when individual tag is moused off */
  function onMouseout(selectedTag) {
    d3.select(this)
      .select('.delete_button')
      .transition(trans('expanding'))
      .attr('opacity', 1e-6)
      .remove();
  }

  const draw = (tags) => {
    // JOIN data to our tags holder
    const tagBars = tagG
      .selectAll('.tag')
      .data(tags, (d) => d.start);

    // EXIT old tags not present in new data.
    tagBars.exit().remove();

    // UPDATE elements that were still there, such as on resize. 
    tagBars
      .attr(
        'transform',
        (d) => `translate(${secToPlot(d.start)},0)`
      )
      .select('rect')
      .style('fill', (d) => d.color)
      .attr('width', (d) => secToPlot(d.end) - secToPlot(d.start));

    // ENTER new tags
    tagBars
      .enter()
      .append('g')
      .attr('class', 'tag')
      .attr(
        'transform',
        (d) => `translate(${secToPlot(d.start)},0)`
      )
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
      .style('fill', (d) => d.color)
      .transition(trans)
      .attr('width', (d) => secToPlot(d.end) - secToPlot(d.start));
  };

  return {draw};
};

module.exports = TagViz;
