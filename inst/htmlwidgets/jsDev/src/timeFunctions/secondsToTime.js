const moment = require('moment');

const secondsToTime = (secs) => moment().startOf('day').seconds(secs);

module.exports = secondsToTime;

