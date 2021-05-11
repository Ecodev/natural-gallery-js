module.exports = {
    server: {
        command: 'yarn serve',
        port: 4444,
    },
    launch: {
        headless: process.env.HEADLESS ?? false,
        devtools: false,
        slowMo: 20,
        defaultViewport: {width: 960, height: 800},
        args: [`--window-size=1500,800`]
    }
};
