import {curry} from 'rambda';

// emits action to add data to redux store. 
export default curry((store, data) => {
  store.dispatch({type: 'ADD_DATA', data});
});
