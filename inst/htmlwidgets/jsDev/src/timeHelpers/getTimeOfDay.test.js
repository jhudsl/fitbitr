import getTimeOfDay from './getTimeOfDay';

const eightAm = 60*60*8;
const midnight = 0;
const elevenFiftyNine = (60*60*24) - 1;

test('Eight oclock', () => {
  expect(getTimeOfDay(eightAm)).toEqual('8:00AM');
});
