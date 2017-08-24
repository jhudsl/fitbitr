import {uniq} from 'rambda';

const dataReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_DATA':
      return [...action.data];
    default:
      return state;
  }
};

module.exports = dataReducer;
