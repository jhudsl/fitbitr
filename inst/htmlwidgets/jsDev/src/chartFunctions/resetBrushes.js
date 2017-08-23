export default (selection, brush) => () => selection.call(brush.move, null);
