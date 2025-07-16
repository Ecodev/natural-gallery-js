const {shutdown} = require('./server');

module.exports = async () => {
    console.log('Global teardown: shutting down server.');
    try {
        await shutdown();
        console.log('Server shutdown completed successfully.');
    } catch (error) {
        console.error('Error during server shutdown:', error);
    }
};
