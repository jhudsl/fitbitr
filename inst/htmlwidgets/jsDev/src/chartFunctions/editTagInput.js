import {curry} from 'rambda';
import * as d3 from 'd3';
import {getTimeOfDay} from '../timeHelpers';

export default curry(
  (
    {type, date, addTag, hideInput, brushReset},
    [start, end],
    {pageX, pageY}
  ) => {
    const tagBody = d3.select('#tagInput');

    // Main container div for all selection.
    if (type === 'hide') {
      tagBody.style('display', 'none');
      return;
    }

    tagBody
      .style('display', 'block')
      .style('left', pageX + 'px')
      .style('top', pageY - 28 + 'px')
      .select('span')
      .text(`Between ${getTimeOfDay(start)} and ${getTimeOfDay(end)}:`);

    // deal with form submit behavior
    tagBody.select('form').on('submit', () => {
      d3.event.preventDefault();
      const tag = tagBody.select('form').select('input')._groups[0][0].value;

      // check to make sure the user put in some form of a tag.
      const tagEmpty = tag === '';
      if (tagEmpty) {
        alert('Please enter a tag label.');
        return;
      }

      const tagMsg = {tag, start, end, date};

      addTag(tagMsg);
      hideInput();
      brushReset();
    });
  }
);
