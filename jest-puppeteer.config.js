module.exports = {
    server: {
        command: 'yarn serve',
        port: 4444,
    },
    launch: {
        headless: false,
        devtools: false,
        slowMo: 20,
        defaultViewport: {width: 960, height: 800},
        args: [`--window-size=1500,800`]
    }
};
