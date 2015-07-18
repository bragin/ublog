var express = require("express");
var nconf = require('nconf');
var relativePath = require("./relativepath");

var app = express();

// For development, so it serves build js/css and static files
app.use('/assets', express.static(relativePath('../build')));
app.use('/', express.static(relativePath('../static')));

app.get('*', function (req, res, next) {
	var payload = {
		user: {
			name: 'placeholder' //req.session.username
		},
		config: {
			url: nconf.get('url')
		}
	};
	var title = 'UBlog';
	var bodyClass = '';
	var content = 'Loading...';

	var result = '<html></html>';

	res.send(result);
});


module.exports = app;
