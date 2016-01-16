"use strict";

var React = require('react');
var api = require('./api'),
	df = require('./dateformat');

// Post in the list
var PostSummary = React.createClass({
	render: function() {

		var post = this.props.post;

		var image = null; //<img className="author-thumb" alt="{{author.name}}" src="{{author.image}}" nopin="nopin" />

		var postDate = new Date(post.ts * 1000);

		var dateIso = df(postDate, 'yyyy-mm-dd HH:MM');// format='YYYY-MM-DD'
		var dateHuman = df(postDate, 'dd mmm yyyy HH:MM'); // format="DD MMMM YYYY"

		var tags = null; // prefix = on

		return (
			<article className={post.className + " container"}>
				<header className="post-header">
					<h2 className="post-title"><a href={post.url}>{post.title}</a></h2>
				</header>
				<section className="post-excerpt">
					<p>{post.excerpt} <a className="read-more" href={post.url}>&raquo;</a></p>
				</section>
				<footer className="post-meta">
					{image}
					{post.author}
					{tags}
					<time className="post-date" dateTime={dateIso}>{dateHuman}</time>
				</footer>
			</article>
		);
	}
});


var Posts = React.createClass({
	getInitialState: function() {
		var st = {
			posts: []
		};

		return st;
	},

	requestUpdate: function() {
		api.getPosts({limit: 5}, this.onUpdateReceived);
	},

	onUpdateReceived: function(res) {
		if (!res) return;

		console.log('onUpdateReceived!', res);

		this.setState({
			posts: res.posts
		});
	},

	componentDidMount: function() {
		// Fetch info if it wasn't provided via init object
		this.requestUpdate();
	},

	render: function() {
		var body = this.state.posts.map(function(post, idx) {
			return <PostSummary key={idx} post={post} />;
		}.bind(this));

		return <div>{body}</div>;
	}
});

module.exports = Posts;
