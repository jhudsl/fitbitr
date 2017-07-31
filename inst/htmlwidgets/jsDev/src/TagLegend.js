const {trans} = require('./chartHelpers');

/** Creates a legend that updates with the currently present tags.*/
const TagLegend = (config) => {
  const {el, tagColors, tags, onHighlight, fontFamily} = config;
  // Header
  el
    .style('font-family', fontFamily)
    .append('div')
    .attr('class', 'legend_header')
    .style('padding', '10px')
    .append('h2')
    .text('Current Tags:');

  // set up flex box environment for parent div
  const legendHolder = el
    .append('div')
    .attr('class', 'legend_holder')
    .style('display', 'flex').style('flex-wrap', 'wrap');

  const update = (tagColors, tags) => {
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
      .selectAll('.tag_color')
      .data(currentTags, (d) => d.tag);

    // EXIT
    tagDivs.exit()
      .transition(trans('leaving'))
      .style('opacity', 0)
      .remove();

    // UPDATE
    tagDivs
      .select('.times_seen')
      .text((d) => `# times: ${d.numTimesSeen}`);

    // ENTER
    const enterDiv = tagDivs
      .enter()
      .append('div')
      .attr('class', 'tag_color')
      .style('width', '100px')
      .style('margin', '5px')
      .style('padding', '3px')
      .style('border-radius', '10px')
      .style('text-align', 'center');

    enterDiv.append('span')
      .style('text-shadow', 'black 0px 0px 10px')
      .style('color', 'white')
      .style('font-weight', 'bold')
      .text((d) => d.tag);
    
    enterDiv.append('br');

    enterDiv.append('span')
      .attr('class', 'times_seen')
      .style('text-shadow', 'black 0px 0px 10px')
      .style('color', 'white')
      .text((d) => `# times: ${d.numTimesSeen}`);
    
    enterDiv
      .transition(trans('entering'))
      .style('background-color', (d) => d.color);
  };

  return {
    update,
  };
};

module.exports = TagLegend;
