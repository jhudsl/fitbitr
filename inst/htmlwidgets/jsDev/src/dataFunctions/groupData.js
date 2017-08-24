import moment from 'moment';

// function sortByDateAscending(a, b) {
//   // Dates will be cast to numbers automagically:
//   return a.date - b.date;
// }

// data = data.sort(sortByDateAscending);
const SToDate = (d) => moment(d).toDate();

export default (data) => {
  
  const grouped = data.reduce((grouped, current) => {
    // check if current date is already in key
    const dateSeen = grouped.hasOwnProperty(current.date);
    // if this is the first time seeing this date, initialize an empty array to push to.
    if (!dateSeen) {
      grouped[current.date] = [];
    }

    // send the whole object through to the outcome.
    grouped[current.date].push(current);

    return grouped;
  }, {});

  return Object.keys(grouped).map((day) => ({
    date: day,
    data: grouped[day],
  })).sort((a, b) => SToDate(b.date) - SToDate(a.date));
};
