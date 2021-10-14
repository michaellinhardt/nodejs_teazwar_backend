const prettyjson = require('prettyjson')
const _ = require('lodash')
const h = require('../helpers')
const { imports: { importDefaultByFilename }, controllers: { getFlattenControllers, runRoute } } = h

const Controllers = importDefaultByFilename(`${__dirname}/../backend/controllers`, '.controller')
const ControllersFlatten = getFlattenControllers(Controllers)


const start = async () => {

    const controller = await runRoute(ControllersFlatten, {
        method: 'get',
        path: '/aaaEmtpy/:ok',
        ok: 'lol',
    })
    
    console.debug(prettyjson.render(controller.payload))
}


start()