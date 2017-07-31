const moment = require('moment');

const secondsToTime = (secs) => moment().startOf('day').seconds(secs);

const timeFormat = d3.timeFormat('%I %p');

const toMonthDay = (date) => moment(date).format('MMM  DD');

const getTimeOfDay = (secs) => {
  const hour = Math.floor(secs / 3600);
  const amPm = hour < 12 ? 'AM' : 'PM';
  const hour12 = hour <= 12 ? hour : hour - 12;
  const mins = Math.floor((secs - hour * 3600) / 60);
  const minPad = ('0' + mins).substr(mins.toString().length - 1);
  return `${hour12}:${minPad}${amPm}`;
};


module.exports = {
  secondsToTime,
  timeFormat,
  toMonthDay,
  getTimeOfDay,
};
