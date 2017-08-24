import * as d3 from 'd3';
import trySelect from './trySelect';

// Set up our document body
document.body.innerHTML = `
<div id = "viz">
  <svg class = "mysupercoolviz">
    <g id = "importantGEl"></g>
  </svg>
</div>
`;

const sel = d3.select('#viz');
const mySvg = trySelect(sel, 'svg', '.mysupercoolviz');

test('Doesnt add second svg', () => {
  expect(sel.selectAll('.mysupercoolviz').size()).toEqual(1);
});

test('Can remove element after trySelection/ binding to selection works', () => {
  mySvg.remove();
  expect(sel.selectAll('.mysupercoolviz').size()).toEqual(0);
});

test('Can add an element if needed.', () => {
  trySelect(sel, 'svg', '#myOtherAwesomeSvg');
  expect(sel.select('#myOtherAwesomeSvg').empty()).toEqual(false);
});
