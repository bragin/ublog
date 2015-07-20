var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var nconf = require('nconf');
var handlebars = require('handlebars');
var relativePath = require("./relativepath");
var themes = require('./themes');

var app = express();

// For development: Serve build js/css and static files
app.use('/assets', express.static(relativePath('../build')));
app.use('/', express.static(relativePath('../static')));

// Attach Express middleware
app.use(cookieSession({ keys: ['blah'] }));
app.use(bodyParser.json());
app.use(cookieParser());

// Theming
themes.init(handlebars);
themes.setTheme('casper');
var appTemplate = handlebars.compile(themes.base);
console.log(themes.base);

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
	//content = React.renderToString(React.createElement(handler, props));

	var result = '<html></html>';

	var result = appTemplate({
		content: content,
		//payload: JSON.stringify(payload),
		bodyClass: bodyClass,
		title: title
	});


	res.send(result);
});


module.exports = app;
