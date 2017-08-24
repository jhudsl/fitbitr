// State object takes for form of
// {
//   data: [
//     {date: "08/08/2017", data: []}, ...
//   ],
//   tags: [
//     {label: <user defined tag label>, uid: <unique id for easier deleting etc>, date: "08/08/2017", start: <start in seconds>, end: <end in seconds>}
//   ]
// }

import {combineReducers} from 'redux';
import dataReducer from './dataReducer';
import tagReducer from './tagReducer';
import tagColorsReducer from './tagColorsReducer';

const mainReducer = combineReducers({
  data: dataReducer,
  tags: tagReducer,
  tagColors: tagColorsReducer,
});

module.exports = mainReducer;
