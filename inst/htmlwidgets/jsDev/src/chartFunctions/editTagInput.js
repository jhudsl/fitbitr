import {curry} from 'rambda';
import * as d3 from 'd3';
import {getTimeOfDay} from '../timeHelpers';

export default curry(({type, date, addTag}, [start, end], {pageX, pageY}) => {
  // Main container div for all selection.
  const tagBody = d3
    .select('#tagInput')
    .style('display', type === 'move' ? 'block' : 'none')
    .style('left', pageX + 'px')
    .style('top', pageY - 28 + 'px');

  tagBody
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
    console.log(tagMsg); 

    addTag(tagMsg)
    // hide();
  });
});
