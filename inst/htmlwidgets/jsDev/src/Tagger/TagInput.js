const d3 = require('d3');
const {getTimeOfDay} = require('../timeHelpers');

/* Main Func */
const TagInput = (config) => {
  // unpack the config.
  const {
    sel,
    scales,
    date,
    onTag,
    fontFamily,
  } = config;

  // Variable to store the time ranges for selections. In seconds into day.
  let timeRange = [];

  const edgeRoundness = '8px';

  // Main container div for all selection.
  const tagBody = sel
    .append('div')
    .style('position', 'absolute')
    .style('text-align', 'center')
    .style('padding', '8px 8px')
    .style('border-radius', edgeRoundness)
    .style('font-family', fontFamily)
    .style('background-color', '#1f78b4')
    .style('display', 'none');

  const tagText = tagBody
    .style('cursor', 'default')
    .style('text-shadow', 'black 0px 0px 20px')
    .style('color', 'white')
    .append('span');

  const tagForm = tagBody.append('form');

  // Wrap tagging in a form element to allow for enter to be used to submit a tag.
  const tagInput = tagForm
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

  // deal with form submit behavior
  tagForm.on('submit', () => {
    d3.event.preventDefault();
    const tag = tagInput._groups[0][0].value;

    // check to make sure the user put in some form of a tag.
    const tagEmpty = tag === '';
    if (tagEmpty) {
      alert('Please enter a tag label.');
      return;
    }
    // pass info to whatever tagging callback we have.
    onTag({
      tag,
      date,
      start: timeRange[0],
      end: timeRange[1],
    });

    hide();
  });

  // hides the tagger.
  const hide = () => {
    // hide the tagging container
    tagBody
      .transition()
      .duration(200)
      .style('opacity', 0)
      .on('end', function() {
        d3.select(this).style('display', 'none');
      });

    // also hide the brush rectangle d3 auto appends.
    sel
      .select('.selection')
      .transition()
      .duration(200)
      .style('fill-opacity', 0)
      .on('end', function() {
        d3.select(this).style('display', 'none').style('fill-opacity', 0.3);
      });
  };

  /* move tagger around. Transition property allows it to be animated or not.*/
  const move = ([start, end], transition = false) => {
    // update the taggers timerange so tags have proper times
    timeRange = [start, end];

    // find the x position in pixels from the seconds provided to move.
    const xPos = scales.toSeconds.invert(start);

    // move the tag box to correct place
    tagBody
      .transition()
      .duration(transition ? 200 : 0)
      .style('opacity', 0.9)
      .style('display', 'inline')
      .style('left', `${xPos + 40}px`);

    // update text of the time.
    tagText.text(`Between ${getTimeOfDay(start)} and ${getTimeOfDay(end)}:`);
  };

  /* Programatically change the input text. Helpful for when new tag is on a different day*/
  const changePlaceholder = (tag) => tagInput._groups[0][0].value = tag;

  return {
    hide,
    move,
    changePlaceholder,
  };
};

module.exports = TagInput;
