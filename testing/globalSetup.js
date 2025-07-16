const {startServer} = require('./server');

module.exports = async () => {
    console.log('Global setup: starting server...');
    await startServer();
};
