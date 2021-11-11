/* eslint-disable brace-style */
/* eslint-disable max-len */
/* eslint-disable require-await */
/* eslint-disable max-statements-per-line */
const _ = require('lodash')
const { resolve } = require('path')
const { readdir } = require('fs').promises
const firstLower = str => str.charAt(0).toLowerCase() + str.substring(1)
const fs = require('fs-extra')

async function *getFiles (dir) {
  const dirents = await readdir(dir, { withFileTypes: true })
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name)
    if (dirent.isDirectory()) {
      yield* getFiles(res)
    } else {
      yield res
    }
  }
}

module.exports = async () => {
  await (async () => {
    try {
      //
      //
      //
      const sizeX = 4
      const sizeY = 4
      let index = 0
      while (index < (sizeX * sizeY)) {
        const id = index + 1
        const y = Math.ceil(id / sizeX)
        const x = id - (sizeX * (y - 1))

        const realX = x - 1
        const realY = y - 1
        console.debug(index, `${realX}x${realY}`)

        index += 1
      }
      //
      //
      //
    } catch (err) { console.error(err) }
  })()
}
