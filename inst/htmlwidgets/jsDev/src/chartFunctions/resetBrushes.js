export default (selection, brush) => () => {
  console.log('reseting brush on', selection);
  selection.call(brush.move, null)
};
