import * as d3 from 'd3';
import subsetData from './subsetData';

const rawData = [
  {xValue: 5, yValue: 14, type: 'heart rate'},
  {xValue: 4, yValue: 13, type: 'heart rate'},
  {xValue: 3, yValue: 12, type: 'steps'},
  {xValue: 2, yValue: 11, type: 'steps'},
  {xValue: 1, yValue: 10, type: 'steps'},
  {xValue: 1, yValue: 10, type: 'heart rate'},
];

const subsetter = subsetData({
  xVal: 'xValue',
  yVal: 'yValue',
  xTransform: (x) => x,
});

test('subsets to steps', () => {
  expect(subsetter('steps', rawData)).toEqual([
    {x: 3, y: 12},
    {x: 2, y: 11},
    {x: 1, y: 10},
  ]);
});
test('subsets to heartrate', () => {
  expect(subsetter('heart rate', rawData)).toEqual([
    {x: 5, y: 14},
    {x: 4, y: 13},
    {x: 1, y: 10},
  ]);
});
