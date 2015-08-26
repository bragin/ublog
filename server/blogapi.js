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

// Blog api
function getBlogInfo() {

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

function loginUser(user, cb) {
	auth.checkUserPassword(rclient, user.email, user.password, function (err, userObj) {
		cb({user: userObj});
	});
}

// Exported object
var blogApi = {
	init: init,
	close: close,
	getBlogInfo: getBlogInfo,
	getPosts: getPosts,
	createPost: createPost,
	updatePost: updatePost,
	deletePost: deletePost,
	getUser: getUser,
	createUser: createUser,
	loginUser: loginUser
}
module.exports = blogApi;
