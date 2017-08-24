import groupTags from './groupTags';
import groupData from './groupData';

const userData = [
  {date: '2001', x: 2010, y: 4},
  {date: '2001', x: 2015, y: 5},
  {date: '2002', x: 2010, y: 6},
  {date: '2002', x: 2015, y: 7},
  {date: '2002', x: 2010, y: 8},
  {date: '2003', x: 2015, y: 9},
  {date: '2003', x: 2015, y: 10},
];

const userTags = [
  {date: '2001', label: 'hi there', y: 4},
  {date: '2001', label: 'ho there', y: 5},
  {date: '2002', label: 'yay there', y: 5},
  {date: '2003', label: 'hojhadfthere', y: 5},
];

const groupedData = groupData(userData);

test('groups properly', () => {
  expect(groupTags(groupedData, userTags)).toEqual([
    {
      date: '2001',
      data: [{date: '2001', x: 2010, y: 4}, {date: '2001', x: 2015, y: 5}],
      tags: [
        {date: '2001', label: 'hi there', y: 4},
        {date: '2001', label: 'ho there', y: 5},
      ],
    },
    {
      date: '2002',
      data: [
        {date: '2002', x: 2010, y: 6},
        {date: '2002', x: 2015, y: 7},
        {date: '2002', x: 2010, y: 8},
      ],
      tags: [{date: '2002', label: 'yay there', y: 5}],
    },
    {
      date: '2003',
      data: [{date: '2003', x: 2015, y: 9}, {date: '2003', x: 2015, y: 10}],
      tags: [{date: '2003', label: 'hojhadfthere', y: 5}],
    },
  ]);
});

