/** @jsx React.DOM */
"use strict";

var React = require('react');
var RouterMixin = require('react-mini-router').RouterMixin;
var navigate = require('react-mini-router').navigate;

var Header = require('./header');

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
				<Header />
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
