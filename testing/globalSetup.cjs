/* global console */
module.exports = async () => {
    console.log('Global setup: starting server...');
    const {startServer} = await import('./server.js');
    await startServer();
};
