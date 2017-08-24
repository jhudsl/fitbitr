import {curry} from 'rambda';

// behavior once a tag is made.
export default curry((store, tag) => {
  store.dispatch({type: 'DELETE_TAG', tag});
});
