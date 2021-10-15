// const { Emitter } = require("@socket.io/redis-emitter")
// const { createClient } = require("redis")
// const redisClient = createClient({ host: "localhost", port: 6379 })
// const emitter = new Emitter(redisClient)

// emitter.to(process.argv[2]).emit('hello, i am cron')


const prettyjson = require('prettyjson')
const _ = require('lodash')
const h = require('../helpers')
const config = require('../config')
const { imports: { importDefaultByFilename }, controllers: { getFlattenControllers, runRoute } } = h

const Controllers = importDefaultByFilename(`${__dirname}/../backend/controllers`, '.controller')
const ControllersFlatten = getFlattenControllers(Controllers)

const executeNextTask = async () => {
    const { payload: cronRouter } = await runRoute(ControllersFlatten, {
        method: 'post',
        path: '/cron/router',
        jwtoken: config.jwt.teazwarToken,
    })

    if (!cronRouter.task) {
        // console.debug('NEXT TASK IN ->', cronRouter.sleep)
        await h.code.sleep(cronRouter.sleep * 1000 - 600)
        return false
    }

    const { cron, task } = cronRouter

    const { payload: taskResult } = await runRoute(ControllersFlatten, {
        method: 'post',
        path: `/cron${task.path}`,
        jwtoken: config.jwt.teazwarToken,
    })

    await runRoute(ControllersFlatten, {
        method: 'post',
        path: '/cron/interval',
        jwtoken: config.jwt.teazwarToken,
        cron,
        task,
        taskResult,
    })

    console.debug(task.path, taskResult)
}

const start = async () => {
    try {
        await executeNextTask()

    } catch (err) { console.debug('error while doing cron task', err) }

    setTimeout(() => start(), config.cron.interval)
}

start()