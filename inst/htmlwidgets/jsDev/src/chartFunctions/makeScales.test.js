import makeScales from './makeScales';

const yMax = 200;
const height = 200;
const width = 500;
const sampleScales = makeScales(yMax, height, width);

test('xRange Correct', () => {
  expect(sampleScales.x.range()).toEqual([0, 500]);
});
test('yRange Correct', () => {
  expect(sampleScales.y.range()).toEqual([200, 0]);
});
test('toSeconds range Correct', () => {
  expect(sampleScales.toSeconds.range()).toEqual([0, 86400]);
});
test('currying works', () => {
  expect(makeScales(yMax)(height, width).x.range()).toEqual(sampleScales.x.range());
});
