// behavior once a tag is made.
const addTag = (store, tag) => {
  store.dispatch({type: 'ADD_TAG', tag});
};

module.exports = addTag;
