const corsProxy = require('cors-anywhere');
const host = '0.0.0.0';
const port = 3007;

/**
 * This is needed to access the deezer API from localhost
 * because they do not allow cross-origin requests by
 * default. This will spin up a proxy server that will
 * forward the necessary headers to allow access.
 */
corsProxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function() {
    console.log('Running on ' + host + ':' + port);
});
