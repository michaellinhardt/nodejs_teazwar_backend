const moment = require('moment')

module.exports = {

  timestampSql: (increaseValue = 0, increaseFormat = 'seconds') => {
    // Create new date instance with the current time
    const newDate = moment().format('YYYY-MM-DD HH:mm:ss')

    // Return the date instance increased if @increaseValue > 0 or return date instance
    return increaseValue > 0 ? newDate.add(increaseValue, increaseFormat) : newDate
  },

  sqlDateToTimestamp: date => parseInt(moment(date).format('X'), 10),

  nowShort: () => moment().format('MM.DD HH:mm:ss'),
  dateShort: (date) => moment(date).format('MM.DD HH:mm:ss'),

  timestamp: () => parseInt(moment().format('X'), 10),
  timestampMs: () => Date.now(),

  msOneSec: 1000,
  msOneMin: 1000 * 60,
  msOneHour: 1000 * 60 * 60,
  msOneDay: 1000 * 60 * 60 * 24,
  msOneWeek: 1000 * 60 * 60 * 24 * 7,
  msOneMonth: 1000 * 60 * 60 * 24 * 7 * 4,
  msOneYear: 1000 * 60 * 60 * 24 * 7 * 4 * 12,

}
