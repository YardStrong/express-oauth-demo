var http = require('http');

let app = require('../app');

let server = http.createServer(app);

var onError = function(error) {
    console.log('[SERVER-ERROR] :');
    console.dir(error);
}

var onListening = function() {
    console.log('[SERVER-LOG ]\t', 'Server started ...');
}

server.listen(app.get('server-port'));
server.on('listening', onListening);
server.on('error', onError);
