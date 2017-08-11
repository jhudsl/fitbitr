const test = require('tape');
const groupByKey = require('./groupByKey');

const userData = [
  {date: '2001', x: 2010, y: 4},
  {date: '2001', x: 2015, y: 5},
  {date: '2002', x: 2010, y: 6},
  {date: '2002', x: 2015, y: 7},
  {date: '2002', x: 2010, y: 8},
  {date: '2003', x: 2015, y: 9},
  {date: '2003', x: 2015, y: 10},
];

const groupByDate = groupByKey('date');
const groupByX = groupByKey('x');

test('groupByDate()', (t) => {
  t.deepEqual(
    groupByDate(userData),
    [
      {
        date: '2001',
        data: [{date: '2001', x: 2010, y: 4}, {date: '2001', x: 2015, y: 5}],
      },
      {
        date: '2002',
        data: [
          {date: '2002', x: 2010, y: 6},
          {date: '2002', x: 2015, y: 7},
          {date: '2002', x: 2010, y: 8},
        ],
      },
      {
        date: '2003',
        data: [
          {date: '2003', x: 2015, y: 9},
          {date: '2003', x: 2015, y: 10},
        ],
      },
    ],
    'groups by date properly'
  );

  t.deepEqual(
    groupByX(userData),
    [
      {
        x: '2010',
        data: [
          {date: '2001', x: 2010, y: 4},
          {date: '2002', x: 2010, y: 6},
          {date: '2002', x: 2010, y: 8},
        ],
      },
      {
        x: '2015',
        data: [
          {date: '2001', x: 2015, y: 5},
          {date: '2002', x: 2015, y: 7},
          {date: '2003', x: 2015, y: 9},
          {date: '2003', x: 2015, y: 10},
        ],
      },
    ],
    'groups by x as well.'
  );
  t.end();
});
