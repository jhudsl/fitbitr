import {curry} from 'rambda';
import moment from 'moment';

import trySelect from './trySelect';

const toMonthDay = (date) => moment(date).format('MMM  DD');

export default curry(({width, height}, svg, date) => {
  const tryText = trySelect(svg, 'text');

  tryText('.current_date')
    .attr('text-anchor', 'middle')
    .attr('font-size', 20)
    .text(toMonthDay(date))
    .attr(
      'transform',
      `translate(${width} , ${height/2.05}) rotate(90)`
    );
});
