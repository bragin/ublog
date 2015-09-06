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
var errCodes = require('../client/errcodes.js');

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
themes.setTheme('bootstrap');
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

// User-related APIs
app.post('/api/user', function (req, res, next) {
	function userCallback(replyObj) {
		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify(replyObj));
	}

	//console.log(req.session.mytoken);
	//req.session.mytoken = 'my token!';

	var params = req.body;
	if (!params.op) return res.status(500).send('Bad API request');

	var replyObj = null;

	switch (params.op) {
		case 'createUser':
			blogApi.createUser(params.info, userCallback);
			break;
		case 'login':
			blogApi.loginUser(params.info, req.session, userCallback);
			break;
		case 'logout':
			blogApi.logoutUser(req.session, userCallback);
			break;
		default:
			return res.send('Unimplemented');
	}
});

// Site-wide APIs
app.post('/api/site', function (req, res, next) {
	function userCallback(replyObj) {
		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify(replyObj));
	}

	var params = req.body;
	if (!params.op) return res.status(500).send('Bad API request');

	var replyObj = null;

	switch (params.op) {
		case 'setInfo':
			blogApi.setSiteInfo(params.info, userCallback);
			break;
		case 'getInfo':
			blogApi.getSiteInfo(userCallback);
			break;
		default:
			return res.send('Unimplemented');
	}
});

app.get('/api/*', function (req, res) {
	res.status(500).send('Bad API request');
});

// Admin / setup area
/*app.get('/setup', function (req, res, next) {
	res.send('Unimplemented');
});*/

// Catch-all handler
app.get('*', function (req, res, next) {

	var tasks = [
		function (cb) {
			// Check if it's first time setup by querying userid 1
			blogApi.getUser(1, function (userObj) {
				cb(null, userObj);
			});
		},
		function (cb) {
			blogApi.isLogged(req.session, function (userObj) {
				cb(null, userObj);
			});
		},
		function (cb) {
			blogApi.getSiteInfo(function (siteInfo) {
				cb(null, siteInfo);
			});
		},
	];

	async.parallel(tasks, function (err, qres) {
		var firstSetup = false;
		if (qres[0] == null) {
			// Display blog setup page
			firstSetup = true;
		}

		var payload = {
			firstSetup: firstSetup,
			user: qres[1],
			site: qres[2],
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
