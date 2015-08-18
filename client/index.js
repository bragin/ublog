/** @jsx React.DOM */
"use strict";

var React = require('react');
var RouterMixin = require('react-mini-router').RouterMixin;
var navigate = require('react-mini-router').navigate;

var Navigation = require('./nav');
var Header = require('./header');
var Footer = require('./footer');
var Posts = require('./posts');

var blogApi = require('./api')

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

	// This is needed here, because it's called by both menu open button inside Header component
	// and menu close button in Navigation component. Ugly, needs to be fixed.
	toggleMenu: function(e) {
		e.preventDefault();

		// Do the dirty hack: toggle class in the body element. Proper fix is to change the theme
		var body = document.body;
		body.classList.toggle('nav-closed');
		body.classList.toggle('nav-opened');
	},

	// Router functions
	render: function() {
		return this.renderCurrentRoute();
	},
	home: function() {

		var blog = {
			title: 'Blog Title',
			description: 'My awesome blog!',
			url: 'http://demo.ublog.io'
		};

		return (
			<div id="root">
				<Navigation blog={blog} toggleMenu={this.toggleMenu} />
				<span className="nav-cover"></span>
				<div className="site-wrapper" id="site-wrapper">
					<Header blog={blog} toggleMenu={this.toggleMenu} />
					<main id="content" className="content" role="main">
						<Posts />
					</main>
					<Footer blog={blog}/>
				</div>
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
   document.getElementById('page')
);
