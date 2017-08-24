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
