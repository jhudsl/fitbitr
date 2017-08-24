import {curry} from 'rambda';

// attempt to make a single selection using d3.select. If it succeeeds then it returns
// that selection to you. Otherwise it adds the desired element type (e.g. div) in the slot
// and gives it the class or id of the identifier.
export default curry(function(parent, type, identifier) {
  const isClass = identifier.split('')[0] === '.';

  const selectionAttempt = parent.select(identifier);

  return selectionAttempt.empty()
    ? parent.append(type).attr(isClass ? 'class' : 'id', identifier.slice(1))
    : selectionAttempt;
});
