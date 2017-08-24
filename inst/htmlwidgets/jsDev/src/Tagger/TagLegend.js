import {curry} from 'rambda';

import trans from '../chartFunctions/transition';
import trySelect from '../chartFunctions/trySelect';

/** Creates a legend that updates with the currently present tags.
 * Tags come in form of array of objects [{tag, start, end, color}]
 * Tag colors is object keyed by tag label {running: 'green', ...} etc. 
*/

const TagLegend = curry((config, tagColors, tags) => {
  const {sel, fontFamily = 'optima', transitionSpeed = 500} = config;

  // check if we already have a legend here.
  const noLegend = sel.select('#tagLegend').empty();

  const tryDiv = trySelect(sel, 'div');

  const el = tryDiv('#tagLegend').style('font-family', fontFamily);

  // a few setup things that only need to be run if this is the first time the legend is being drawn.
  if (noLegend) {
    el // Header
      .append('div')
      .attr('class', 'legendHeader')
      .style('padding', '10px')
      .append('h2')
      .text('Current Tags:');
  }

  // set up flex box environment for parent div
  const legendHolder = trySelect(el, 'div', '.legend_holder')
    .style('display', 'flex')
    .style('flex-wrap', 'wrap');

  // Sort through tags and find which ones are shown and their colors.
  const currentTags = Object.keys(tagColors)
    .map((tag) => ({
      tag,
      color: tagColors[tag],
      numTimesSeen: tags.filter((t) => t.tag === tag).length,
    }))
    .filter((tag) => tag.numTimesSeen > 0);

  // JOIN
  const tagDivs = legendHolder
    .selectAll('.tagColor')
    .data(currentTags, (d) => d.tag);

  // EXIT
  tagDivs
    .exit()
    .transition(trans('exiting', transitionSpeed))
    .style('opacity', 0)
    .remove();

  // UPDATE
  tagDivs.select('.times_seen').text((d) => `# times: ${d.numTimesSeen}`);

  // ENTER
  const enterDiv = tagDivs
    .enter()
    .append('div')
    .attr('class', 'tagColor')
    .style('width', '100px')
    .style('margin', '5px')
    .style('padding', '3px')
    .style('border-radius', '10px')
    .style('text-align', 'center');

  enterDiv
    .append('span')
    .style('text-shadow', 'black 0px 0px 10px')
    .style('color', 'white')
    .style('font-weight', 'bold')
    .text((d) => d.tag);

  enterDiv.append('br');

  enterDiv
    .append('span')
    .attr('class', 'times_seen')
    .style('text-shadow', 'black 0px 0px 10px')
    .style('color', 'white')
    .text((d) => `# times: ${d.numTimesSeen}`);

  enterDiv
    .transition(trans('entering', transitionSpeed))
    .style('background-color', (d) => d.color);
});
module.exports = TagLegend;
