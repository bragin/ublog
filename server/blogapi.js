"use strict";

// This API eventually will become DB-agnostic, however right now it's tied to Redis DB
var nconf = require('nconf');
var redis = require('redis');
var async = require('async');

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
	if (!isAdmin(req.session)) {
		return cb({
			err: 'Insufficient permissions'
		});
	}

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

/* Posts api
	query may contain:
		uid: user whose posts to get
		fields: an array of fields to get
		tsBegin:
		tsEnd:
		limit: max number of posts to get
		filter:
			tags
			shorturl
		ptype: draft, published, deleted
*/
function getPost(pid, cb) {
	rclient.hgetall('post:' + pid, function (err, res) {
		cb(res);
	});
}

function getPosts(query, cb) {
	// Normalize query
	//if (!query.uid) query.uid = 1;// If userid is not specified - assume blog owner
	if (!query.limit || query.limit <= 0) query.limit = 1;
	if (!query.ptype) query.ptype = 'published';

	// Check if this is single post load request
	if (query.pid) {
		// Serve it right away
		getPost(query.pid, function (post) {
			cb(post);
		});
		return;
	}

	// Query all posts in the system
	var task = [];

	var setKeyName = 'posts';

	task.push(function (cb2) {
		rclient.zrevrange(setKeyName, 0, query.limit - 1, function (err2, res2) {
			cb2(null, res2);
		});
	});

	async.parallel(task, function (err3, res3) {
		// Now query contents of those posts
		var tasks2 = [];
		res3[0].forEach(function (pid) {
			tasks2.push(function (cb3) {
				rclient.hgetall('post:' + pid, function (err4, res4) {
					cb3(null, res4);
				});
			});
		});

		async.parallel(tasks2, function (err5, res5) {

			return cb({
				posts: res5
			});
		});
	});
}

function getNewPostId(cb) {
	rclient.incr("globals:nextPostId", function (err, pid) {
		if (err == null)
			cb(pid);
		else
			cb(null);
	});
}

function unredisPost(post) {
	post.id = parseInt(post.id, 10);
	post.uid = parseInt(post.uid, 10);
	post.ts = parseInt(post.ts, 10);
	post.published = (post.published != '0');
}

function updatePost(params, cb) {
	var task = [];

	var userid = 1;

	// TODO: Preprocess the post
	var abstract = 'abstract';

	if (params.id == 0) {
		task.push(function (cb2) {
			// This is a new post, get a new id for it
			getNewPostId(function (pid) {
				// Fill up the contents and store in the db
				var post = {
					id: pid,
					uid: userid,
					className: 'post',
					ts: Math.floor(Date.now() / 1000),
					url: '',
					title: params.title,
					excerpt: abstract,
					content: params.content,
					published: params.published ? '1' : '0'
				};

				return cb2(null, post);
			});
		});
	} else {
		// Update existing post, get its previous contents
		task.push(function (cb2) {
			getPost(params.id, function (post) {

				if (post) {
					// Update its fields
					post.url = '';
					post.title = params.title;
					post.excerpt = abstract;
					post.content = params.content;
					post.published = params.published ? '1' : '0';
				}

				return cb2(null, post);
			});
		});
	}

	async.series(task, function (err, res) {
		// Check for errors...
		if (res[0] == null) return cb(null);

		// Save it in the database, transactionally adding to respective sets
		var post = res[0];

		var trans = rclient.multi();
			trans.hmset('post:' + post.id, post);
			if (post.published) {
				trans.zadd('posts', post.ts, post.id);
				trans.zrem('drafts', post.ts, post.id);
			} else {
				trans.zrem('posts', post.ts, post.id);
				trans.zadd('drafts', post.ts, post.id);
			}
			trans.zadd('user:' + userid + ':posts', post.ts, post.id);
			trans.zadd('all', post.ts, post.id);
		trans.exec(function (err2, info) {
			// Convert it back into JavaScript before sending tothe user
			unredisPost(post);
			return cb(post);
		});
	});
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

function isAdmin(session) {
	if (session.user && session.user.permissions.owner == true)
		return true;
	else
		return false;
}

// Exported object
var blogApi = {
	init: init,
	close: close,
	getSiteInfo: getSiteInfo,
	setSiteInfo: setSiteInfo,
	getPosts: getPosts,
	updatePost: updatePost,
	deletePost: deletePost,
	getUser: getUser,
	createUser: createUser,
	loginUser: loginUser,
	logoutUser: logoutUser,
	isLogged: isLogged,
	isAdmin: isAdmin
}
module.exports = blogApi;
