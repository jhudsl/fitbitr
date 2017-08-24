export default (sel) => {
  const edgeRoundness = '8px';

  // Main container div for all selection.
  const tagBody = sel
    .append('div')
    .attr('id', 'tagInput')
    .style('position', 'absolute')
    .style('text-align', 'center')
    .style('padding', '8px 8px')
    .style('border-radius', edgeRoundness)
    .style('background-color', '#1f78b4')
    .style('display', 'none');

  // displayed text for tag (e.g. between time and b)
  tagBody
    .style('cursor', 'default')
    .style('text-shadow', 'black 0px 0px 20px')
    .style('color', 'white')
    .append('span');

  const tagForm = tagBody.append('form');

  // Wrap tagging in a form element to allow for enter to be used to submit a tag.
  // Text input for tag label
  tagForm
    .append('input')
    .attr('type', 'text')
    .attr('name', 'activity_tag')
    .style('margin-top', '4px')
    .style('margin-right', '4px')
    .style('background-image', 'linear-gradient(#b5b5b5, #858385)')
    .style('border-radius', edgeRoundness)
    .style('border', '1px solid #464646')
    .style('padding', '1px 4px')
    .style('text-shadow', 'black 0px 0px 20px');

  // add submit button
  tagForm
    .append('input')
    .attr('type', 'submit')
    .attr('value', 'tag')
    .style('margin-left', '3px')
    .style('border', '0')
    .style('background-image', 'linear-gradient(#b5b5b5, #858385)')
    .style('border-radius', edgeRoundness);
};
