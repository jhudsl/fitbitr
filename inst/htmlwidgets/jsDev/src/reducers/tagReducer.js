const tagReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TAG':
      return [...state, action.tag];
    case 'DELETE_TAG':
      return state.filter((t) => t !== action.tag);
    default:
      return state;
  }
};

module.exports = tagReducer;
