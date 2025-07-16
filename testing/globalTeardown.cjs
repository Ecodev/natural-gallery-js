/* global console */
module.exports = async () => {
    console.log('Global teardown: shutting down server.');
    try {
        const {shutdown} = await import('./server.js');
        await shutdown();
        console.log('Server shutdown completed successfully.');
    } catch (error) {
        console.error('Error during server shutdown:', error);
    }
};
