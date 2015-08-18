var http = require('http');
var nconf = require('nconf');
var relativePath = require('./relativepath');

nconf.argv()
     .env('_')
     .file({ file: relativePath('../config/config.json')})
     .defaults({
        somevar: 'FIXME'
});

var app = require('./app');

var server = http.createServer(app);
server.listen(nconf.get('http:port'));

console.log('Server listening on ' + nconf.get('http:port') + '...');
