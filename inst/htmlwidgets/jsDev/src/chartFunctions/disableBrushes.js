import {select, selectAll} from 'd3';

// takes a supplied date and will disable all brushes except the given dates.
export default (currentDate) => {
  selectAll('.brush').each(function() {
    const brushSel = select(this);
    if (!brushSel.classed(currentDate)) {
      brushSel.select('.selection').style('display', 'none');
      brushSel.selectAll('.handle').style('display', 'none');
    }
  });
};
