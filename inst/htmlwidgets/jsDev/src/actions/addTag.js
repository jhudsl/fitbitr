import {curry} from 'rambda';

// behavior once a tag is made.
export default curry((store, tag) => {
  store.dispatch({type: 'ADD_TAG', tag});
});
