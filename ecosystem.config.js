const Sunucu_1 = "Everest";
module.exports = {
    apps: [    
        {
            name: `${Sunucu_1}-MOD`,
            script: "./Moderasyon/main.js",
            watch: false
        },
        {
            name: `${Sunucu_1}-EXECUTİVE`,
            script: "./Executive/main.js",
            watch: false
        },
        {
            name: `${Sunucu_1}-STATS`,
            script: "./Stats/main.js",
            watch: false
        },
        {
            name: `${Sunucu_1}-LOGS`,
            script: "./Log/main.js",
            watch: false
        },
        {
            name: `${Sunucu_1}-ASYNC`,
            script: "./Async/main.js",
            watch: false
        }
    ]
};
