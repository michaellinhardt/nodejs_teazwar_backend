const moment = require('moment')
const { v1 } = require('uuid')

const users = [{
    uuid: '1e8b6bf0-1b50-11ec-85ec-4d033c80c035',
    user_id: '728591707',
    username: 'teazwar',
    display_name: 'TeazWar',
    jwtoken: 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiYmU4NTU3YTAtMmI1Zi0xMWVjLWEzMTItZWZkYzc5NDk1YmJlIiwiaWF0IjoxNjM0MDQ1MDc1LCJleHAiOjE5NDk0MDUwNzUsImF1ZCI6Imh0dHBzOi8vdGVhenlvdS5jb20iLCJpc3MiOiJUZWF6TW9kIiwic3ViIjoiMWU4YjZiZjAtMWI1MC0xMWVjLTg1ZWMtNGQwMzNjODBjMDM1In0.j1EiTS8esVMG_XL1_dOBhctsn5eU1tWFgkPnWrOgItf43ZDzWeWezdWqgLZ7wAUy68CG7V074j9Ex7XJAnL2y7ThyJisDH_KjTcgf9g29vIxGnFsx4TW4pQfCbgV-XrjEpck_A7tvEAYe_A3UNa6Vp1f5mCwsfRDhaWDxVaqQ_0',
},
{
    uuid: '29e86b60-1b64-11ec-b0db-6ba803c7d2d7',
    user_id: '720229257',
    username: 'teazyou',
    display_name: 'TeazYou',
    isSubscriber: 'yes',
    isBot: 'no',

}]

const addAdmin = (uuid, user_uuid) => ({
    uuid,
    user_uuid,
    pause: true,
    resume: true,
    xppermin: true,
})

const admins = [
        addAdmin('7e8cc9e0-1c9a-11ec-be7c-2159a9e73249', users[0].uuid),
        addAdmin('7e8cc9e1-1c9a-11ec-be7c-2159a9e73249', users[1].uuid),
]

const events_global = [{
    uuid: v1(),
    event_name: 'database_reseted',
    event_data: '{}'
}]

exports.users = users
exports.admins = admins
exports.events_global = events_global
