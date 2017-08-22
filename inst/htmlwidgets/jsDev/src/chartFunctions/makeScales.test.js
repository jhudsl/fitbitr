import makeScales from './makeScales';

const sampleMargins = {left: 11, right: 12, top: 13, bottom: 14};
const yMax = 200;
const height = 200;
const width = 500;
const sampleScales = makeScales(sampleMargins, yMax, height, width);

test('xRange Correct', () => {
  expect(sampleScales.x.range()).toEqual([0, 500 - 23]);
});
test('yRange Correct', () => {
  expect(sampleScales.y.range()).toEqual([200 - (13 + 14), 0]);
});
test('toSeconds range Correct', () => {
  expect(sampleScales.toSeconds.range()).toEqual([0, 86400]);
});
test('currying works', () => {
  expect(makeScales(sampleMargins, yMax)(height, width).x.range()).toEqual(sampleScales.x.range());
});
