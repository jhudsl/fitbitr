import {uniq, map} from 'rambda';

// pallet from colorbrewer.
const tagColors = [
  '#a6cee3',
  '#1f78b4',
  '#b2df8a',
  '#33a02c',
  '#fb9a99',
  '#e31a1c',
  '#fdbf6f',
  '#ff7f00',
  '#cab2d6',
  '#6a3d9a',
  '#ffff99',
  '#b15928',
];

export default (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TAG':
      // get list of unique tags
      const {tag} = action.tag;
      const uniqueTags = Object.keys(state);
      const oldTag = uniqueTags.includes(tag);
      // debugger;
      return !oldTag
        ? {...state, [tag]: tagColors[uniqueTags.length]}
        : state;
    default:
      return state;
  }
};
