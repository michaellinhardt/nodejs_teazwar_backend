module.exports = {
    endpoint: '/cron',

    interval: 3000,
    twitchApiInterval: 2,
    twitchApiNext: 0,

    viewerOnlineUntill: 60 * 2,
    chatterValidatedUntill: 60 * 3, // after validating a chatters nickname with twitch api, we dont make it again until..

    chattersUnFollowerControlEvery: 60 * 60 * 24,
    chattersNewFollowerControlEvery: 60 * 5,
    globalFollowingControlEvery: 60 * 60 * 24 * 7,

    followingBotsMultiplier: 5, // each timer for bot user is multiplied by this value, so bot are verified less often

    tasks: [{
        path: '/chatters/listing',
        isTwitchApi: true,
        interval: 20,
        intervalEmpty: 20,
        intervalRetry: 20,
        timestampNext: 0,
        // isEnabled: false,
        },{

        path: '/chatters/validate',
        isTwitchApi: true,
        interval: 0,
        intervalEmpty: 20,
        intervalRetry: 20,
        timestampNext: 0,
        // isEnabled: false,
        },{

        path: '/chatters/xpgain',
        isTwitchApi: false,
        interval: 0,
        intervalEmpty: 20,
        intervalRetry: 20,
        timestampNext: 0,
        // isEnabled: false,
        },{

        path: '/xp/levelup',
        isTwitchApi: false,
        interval: 0,
        intervalEmpty: 60,
        intervalRetry: 60,
        timestampNext: 0,
        // isEnabled: false,
        },{

        path: '/chatters/bots',
        isTwitchApi: false,
        interval: 60 * 60 * 1,
        intervalEmpty: 60 * 60 * 2,
        intervalRetry: 60 * 60 * 1,
        timestampNext: 0,
        // isEnabled: false,
        },{

        path: '/chatters/newfollower',
        isTwitchApi: true,
        interval: 0,
        intervalEmpty: 60 * 5,
        intervalRetry: 60 * 5,
        timestampNext: 0,
        // isEnabled: false,
        },{

        path: '/chatters/unfollower',
        isTwitchApi: true,
        interval: 0,
        intervalEmpty: 60 * 60 * 12,
        intervalRetry: 60 * 5,
        timestampNext: 0,
        // isEnabled: false,
        },{

        path: '/global/following',
        isTwitchApi: true,
        interval: 0,
        intervalEmpty: 60 * 60,
        intervalRetry: 60 * 60,
        timestampNext: 0,
        // isEnabled: false,
    }],
}