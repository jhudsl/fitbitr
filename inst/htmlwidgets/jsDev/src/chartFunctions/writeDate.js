import {curry} from 'rambda';

import trySelect from './trySelect';
import toMonthDay from '../timeHelpers/toMonthDay';

export default curry(({width, height}, svg, date) => {
  const tryText = trySelect(svg, 'text');

  tryText('.current_date')
    .attr('text-anchor', 'middle')
    .attr('font-size', 20)
    .text(toMonthDay(date))
    .attr(
      'transform',
      `translate(${width + 20} , ${height/2.05}) rotate(90)`
    );
});
