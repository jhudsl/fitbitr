import * as d3 from 'd3';
import TagLegend from './TagLegend';

// Set up our document body
document.body.innerHTML = '<div id = "viz"> </div>';

const sel = d3.select('#viz');
const legendGen = TagLegend({sel, fontFamily: 'optima', transitionSpeed: 0});

test('Appends a legend div.', () => {
  legendGen([], []);
  expect(sel.select('#tagLegend').empty()).toEqual(false);
});

test('Adds a header properly', () => {
  expect(sel.select('.legendHeader').empty()).toEqual(false);
});

test('No tags when not supplied any', () => {
  expect(sel.select('#tagLegend').selectAll('.tagColor').size()).toEqual(0);
});

test('tags there when a single one added', () => {
  legendGen({running: 'green'}, [{tag: 'running'}]);
  console.log(document.body.innerHTML);
  expect(sel.select('#tagLegend').selectAll('.tagColor').size()).toEqual(1);
});
