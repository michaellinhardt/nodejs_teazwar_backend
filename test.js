// const h = require('./helpers')
// const _ = require('lodash')
// const { render } = require('prettyjson')

class testeuh {

  onDelete () { console.info('no on delete method') }

}

class testeuhh extends testeuh {
  // onDelete () { console.info('deleted!') }
}

const start = () => {
  const test = new testeuhh()
  test.onDelete()
  process.exit(0)
}

start()

