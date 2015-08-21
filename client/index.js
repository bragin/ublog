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
		'/setup': 'setup', // First setup
		'/'     : 'home', // front page
	},

	getInitialState: function() {
		return {};
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

	// Router functions
	render: function() {
		return this.renderCurrentRoute();
	},
	setup: function() {
		var payload = this.parsePayload();
		console.log(payload);

		if (!payload || !payload.firstSetup) {
			navigate('/', true);
			return <div/>;
		}

		return (
			<div id="root">
				<header className="main-header">
					<div className="vertical">
						<section className="setup-box">
							<form className="setup-form" onSubmit={this.onLogin}>
								<div className="email-wrap">
									<span className="icon input-icon icon-mail">
										<input className="email" autoCapitalize="off" autoCorrect="off" autoFocus="" placeholder="Email Address" ref="email" type="email" />
									</span>
								</div>
								<div className="password-wrap">
									<span className="icon input-icon icon-lock">
										<input className="password" placeholder="Password" ref="password" type="password" />
									</span>
								</div>
								<button className="btn btn-blue login-button" type="submit">own it</button>
							</form>
						</section>
					</div>
				</header>
				<div className="site-wrapper" id="site-wrapper">
				</div>
			</div>);
	},
	home: function() {

		var payload = this.parsePayload();

		// Redirect to the first setup page if necessary
		if (payload && payload.firstSetup) {
			navigate('/setup', true);
			return <div/>;
		}

		var blog = {
			title: 'Blog Title',
			description: 'My awesome blog!1',
			url: 'http://demo.ublog.io',
			api: blogApi
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
