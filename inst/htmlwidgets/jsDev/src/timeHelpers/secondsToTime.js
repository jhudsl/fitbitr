import moment from 'moment';
export default (secs) => moment().startOf('day').seconds(secs);
