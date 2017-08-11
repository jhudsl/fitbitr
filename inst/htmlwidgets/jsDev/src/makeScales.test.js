const test = require('tape');
const makeScales = require('./makeScales');

const margins1 = {left: 40, right: 80, top: 60, bottom: 30};
const margins2 = {left: 50, right: 20, top: 60, bottom: 30};

const scales1 = makeScales(margins1);
const scales2 = makeScales(margins2);

const config1 = {dayHeight: 250, width: 400, yMax: 200};
const config2 = {dayHeight: 150, width: 200, yMax: 150};

test('makeScales()', (t) => {
  t.deepEqual(
    scales1(config1).x.range(),
    [0, config1.width - margins1.left - margins1.right],
    'x scale right for first config.'
  );

  t.deepEqual(
    scales1(config1).y.range(),
    [config1.dayHeight - margins1.top - margins1.bottom, 0],
    'y scale right for first config.'
  );
  t.deepEqual(
    scales1(config1).y.domain(),
    [0, config1.yMax],
    'y scale domain for first config.'
  );

  // /////

  t.deepEqual(
    scales2(config2).x.range(),
    [0, config2.width - margins2.left - margins2.right],
    'x scale right for second config.'
  );

  t.deepEqual(
    scales2(config2).y.range(),
    [config2.dayHeight - margins2.top - margins2.bottom, 0],
    'y scale right for second config.'
  );
  t.deepEqual(
    scales2(config2).y.domain(),
    [0, config2.yMax],
    'y scale domain for second config.'
  );

  t.end();
});
