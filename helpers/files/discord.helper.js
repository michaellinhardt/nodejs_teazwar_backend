const moment = require('moment')

module.exports = {

  nowDate: () => ` 📅 ${moment().format('YYYY-MM-DD')} ⏱️ ${moment().format('HH:mm:ss')}`,

}
