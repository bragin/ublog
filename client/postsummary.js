/** @jsx React.DOM */
"use strict";

var React = require('react');

// Post in the list
var PostSummary = React.createClass({
	render: function() {

		var post = this.props.post;

		var image = null; //<img className="author-thumb" alt="{{author.name}}" src="{{author.image}}" nopin="nopin" />

		var dateIso = '2015-07-24';// format='YYYY-MM-DD'
		var dateHuman = '24 July 2015'; // format="DD MMMM YYYY"
		var tags = null; // prefix = on

		return (
			<article className={post.className}>
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

module.exports = PostSummary;
