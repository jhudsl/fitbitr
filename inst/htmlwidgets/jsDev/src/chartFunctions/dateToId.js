// The default -s in the dates cant be used as ids in html.
// converts a date string to an id for use with managing divs.
module.exports = (date) => `date_${date.replace(/-/g, '_')}`;
