import { uniq, map } from 'rambda';

// pallet from colorbrewer.
const tagColors = [
  '#e41a1c',
  '#377eb8',
  '#4daf4a',
  '#984ea3',
  '#ff7f00',
  '#ffff33',
  '#a65628',
  '#f781bf',
  '#999999'
];

export default (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TAG':
      // get list of unique tags
      const { tag } = action.tag;
      const uniqueTags = Object.keys(state);
      const oldTag = uniqueTags.includes(tag);
      // debugger;
      return !oldTag
        ? { ...state, [tag]: tagColors[uniqueTags.length % tagColors.length] }
        : state;
    default:
      return state;
  }
};
