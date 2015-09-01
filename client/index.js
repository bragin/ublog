/** @jsx React.DOM */
"use strict";

var React = require('react');
var RouterMixin = require('react-mini-router').RouterMixin;
var navigate = require('react-mini-router').navigate;

var Navigation = require('./nav');
var Header = require('./header');
var Footer = require('./footer');
var Posts = require('./posts');
var Setup = require('./setup');

var blogApi = require('./api')

// Root component
var RootComponent = React.createClass({
	mixins: [RouterMixin],
	routes: {
		'/blah' : 'page1', // Some other page
		'/setup': 'setup', // First setup
		'/'     : 'home', // front page
	},

	events: {},

	getInitialState: function() {
		return {
			firstSetup: false,
			title: 'Blog Title',
			description: 'My awesome blog!1',
			url: 'http://demo.ublog.io',
			api: blogApi,
			user: null
		};
	},

	parsePayload: function() {
		var payload = document.getElementById('payload');
		if (payload) payload = JSON.parse(payload.innerHTML);
		return payload;
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

	componentWillMount: function() {
		// Create the events object for children
		this.events.onLogin = this.onLogin;
		this.events.onLogout = this.onLogout;
		this.events.toggleMenu = this.toggleMenu;

		// Parse the payload into the state
		var payload = this.parsePayload();

		this.setState({
			firstSetup: payload.firstSetup,
			user: payload.user
		});
	},

	// Events for children
	onLogin: function (res) {
		this.setState({
			user: res.user
		});
	},
	onLogout: function() {
		this.setState({
			user: null
		});
	},
	onSiteInfoUpdate: function(info) {
		var title = info.title;
		var desc = info.desc;

		if (!title) title = this.state.title;
		if (!desc) desc = this.state.desc;

		this.setState({
			title: title,
			desc: desc
		});
	},

	// Router functions
	render: function() {
		return this.renderCurrentRoute();
	},
	setup: function() {
		if (this.state.firstSetup) {
			setTimeout(function() { navigate('/'); }, 100);
			return <div>This blog has already been set up.</div>;
		}

		return (
			<div id="root">
				<header className="main-header">
					<div className="vertical">
						<Setup blog={this.state} />
					</div>
				</header>
				<div className="site-wrapper" id="site-wrapper">
				</div>
			</div>);
	},
	home: function() {
		// Redirect to the first setup page if necessary
		if (this.state.firstSetup) {
			setTimeout(function() { navigate('/setup'); }, 100);
			return <div/>;
		}

		return (
			<div id="root">
				<Navigation blog={this.state} events={this.events} />
				<span className="nav-cover"></span>
				<div className="site-wrapper" id="site-wrapper">
					<Header blog={this.state} toggleMenu={this.toggleMenu} />
					<main id="content" className="content" role="main">
						<Posts />
					</main>
					<Footer blog={this.state}/>
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
