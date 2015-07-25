/** @jsx React.DOM */
"use strict";

var React = require('react');
var RouterMixin = require('react-mini-router').RouterMixin;
var navigate = require('react-mini-router').navigate;

var Header = require('./header');
var PostSummary = require('./postsummary');

// Root component
var RootComponent = React.createClass({
	mixins: [RouterMixin],
	routes: {
		'/blah' : 'page1', // Some other page
		'/'     : 'home', // front page
	},

	getInitialState: function() {
		return {};
	},

	// Router functions
	render: function() {
		return this.renderCurrentRoute();
	},
	home: function() {
		return (
			<div id="root">
				<Header title="Blog Title" description="My awesome blog!" url="/" />
				<PostSummary post={{
						author: 'Alex',
						ts: 1010101010,
						url: 'firstpost',
						title: 'Post title',
						excerpt: 'First paragraph of a post'
				}}/>
			</div>
			);
	},
	page1: function() {
		return (
			<div id="root">
				Page 1
			</div>
			);
	},
	notFound: function(path) {
		return <div className="not-found">Page Not Found: {path}</div>;
	}
});

React.render( 
   <RootComponent history='true' />, 
   document.getElementById('body')
);
