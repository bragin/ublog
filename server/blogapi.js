"use strict";

// This API eventually will become DB-agnostic, however right now it's tied to Redis DB
var nconf = require('nconf');
var redis = require('redis');

var auth = require('./auth');

var rclient;


// Establish connection to the db
function init() {
	close();

	var host = nconf.get('redis:host');
	var port = nconf.get('redis:port');
	var db = nconf.get('redis:db');
	if (!port) port = 6379;

	rclient = redis.createClient(port, host);

	if (db) {
		console.log('ERROR: Using Redis db number other than 0 is not supported yet!');
		redis.select(db, function () {
		});
	}

	rclient.on('error', function (err) {
		console.log('Db error: ' + err);
	});
}

// Unused atm
function close() {
	if (rclient) rclient.quit();
}

// Site-wide APIs
function getSiteInfo(cb) {
	rclient.hgetall('site', function (err, siteInfo) {
		if (!siteInfo) siteInfo = {};
		if (!siteInfo.title) siteInfo.title = 'My new blog title';
		if (!siteInfo.description) siteInfo.description = 'Describe your blog here';

		cb(siteInfo);
	});
}

function setSiteInfo(info, cb) {
	var dbObj = {};

	if (info.title)
		dbObj.title = info.title.trim().substring(0, 10);

	if (info.desc)
		dbObj.description = info.desc.trim().substring(0, 200);

	rclient.hmset('site', dbObj, function (err) {
		cb({
			title: dbObj.title,
			desc: dbObj.description
		});
	});
}

// Posts api
function getPosts(query) {
	console.log(query);

	// If userid is not specified - assume blog owner
	if (!query.uid) query.uid = 1;

	// DEBUG!
	var posts = [];
	posts.push({
		className: 'post',
		author: 'Alex',
		ts: 1010101010,
		url: 'firstpost',
		title: 'Post title',
		excerpt: 'First paragraph of a post3'
	});
	posts.push(
		{
			className: 'post',
			author: 'Alex',
			ts: 1010101010,
			url: 'secondpost',
			title: 'Older post',
			excerpt: 'First paragraph of a post1'
		});

	return {
		posts: posts
	}
}

function createPost() {
}

function updatePost() {
}

function deletePost() {
}

// User related functions
function getUser(uid, cb) {
	auth.getUser(rclient, uid, cb);
}

function createUser(user, cb) {
	auth.registerNewUser(rclient, user, 'owner', function (uid) {
		cb({ uid: uid });
	});
}

function loginUser(user, session, cb) {
	auth.checkUserPassword(rclient, user.email, user.password, function (err, userObj, uid) {

		// Always promote userid 1 to owner
		if (uid == 1)
			userObj.permissions.owner = true;

		session.user = userObj;
		cb({err: err, user: userObj});
	});
}

function logoutUser(session, cb) {
	session.user = null;
	cb();
}

function isLogged(session, cb) {
	cb(session.user);
}

// Exported object
var blogApi = {
	init: init,
	close: close,
	getSiteInfo: getSiteInfo,
	setSiteInfo: setSiteInfo,
	getPosts: getPosts,
	createPost: createPost,
	updatePost: updatePost,
	deletePost: deletePost,
	getUser: getUser,
	createUser: createUser,
	loginUser: loginUser,
	logoutUser: logoutUser,
	isLogged: isLogged
}
module.exports = blogApi;
