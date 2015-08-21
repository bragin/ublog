"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var nconf = require('nconf');
var handlebars = require('handlebars');
var async = require('async');
var relativePath = require("./relativepath");
var themes = require('./themes');
var blogApi = require('./blogapi');

var app = express();

// For development: Serve build js/css and static files
app.use('/themes', express.static(relativePath('../themes')));
app.use('/assets', express.static(relativePath('../build')));
app.use('/', express.static(relativePath('../static')));

// Attach Express middleware
app.use(cookieSession({ keys: ['blah'] }));
app.use(bodyParser.json());
app.use(cookieParser());

// Initialize blogApi
blogApi.init();

// Theming
themes.init(handlebars);
themes.setTheme('casper');
var themeDefault = handlebars.compile(themes.default);

// Routing

// API requests
app.post('/api/posts', function (req, res) {

	var params = req.body;
	try {
		params.limit = parseInt(params.limit, 10);
		if (params.limit < 1) params.limit = 1;
		if (params.limit > 10) params.limit = 10;
	} catch (e) {
		return res.status(500).send('Bad API request');
	}

	var obj = blogApi.getPosts(req.body);
	res.set('Content-Type', 'application/json');
	res.send(JSON.stringify(obj));
});

// Show specific post
app.get('/api/:post', function (req, res, next) {
	res.send('Unimplemented');
});

// Login
app.post('/api/login', function (req, res, next) {
	//console.log(req.session.mytoken);
	//req.session.mytoken = 'my token!';
	res.send('Unimplemented');
});

app.get('/api/*', function (req, res) {
	res.status(500).send('Bad API request');
});

// Admin / setup area
app.get('/ublog', function (req, res, next) {
	res.send('Unimplemented');
});

// Catch-all handler
app.get('*', function (req, res, next) {

	var tasks = [function (cb) {
		// Check if it's first time setup by querying userid 1
		blogApi.getUser(1, function (userObj) {
			cb(null, userObj);
		});
	},
	function (cb) {
		cb(null, null);
	}];

	async.parallel(tasks, function (err, qres) {
		var firstSetup = false;
		if (qres[0] == null) {
			// Display blog setup page
			firstSetup = true;
		}

		var payload = {
			firstSetup: firstSetup,
			user: {
				name: 'placeholder' //req.session.username
			},
			config: {
				url: nconf.get('url')
			}
		};
		var title = 'UBlog';
		var footer = '<script id="payload" type="application/payload">' + JSON.stringify(payload) + '</script>' +
					'<script src="/assets/js/app.js"></script>';

		var content = 'Loading...';
		//content = React.renderToString(React.createElement(handler, props));

		// FIXME: Should be different for other pages! Look into Ghost/core/server/helpers/body_class.js for details
		var bodyClass = 'home-template';

		var result = themeDefault({
			body: content,
			title: title,
			ublog_foot: footer,
			body_class: bodyClass
		});


		res.send(result);
	});
});


module.exports = app;
