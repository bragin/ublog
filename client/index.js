"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var RouterMixin = require('react-mini-router').RouterMixin;
var navigate = require('react-mini-router').navigate;

var Sidebar = require('./sidebar');
var NavBar = require('./navbar');
var Header = require('./header');
var Footer = require('./footer');
var Posts = require('./posts');
var Setup = require('./setup');
var Editor = require('./editor');

var blogApi = require('./api')

// Needed for WebPack CSS loader to process the file
require("../themes/bootstrap/assets/css/ublog.css");

// Root component
var RootComponent = React.createClass({
	mixins: [RouterMixin],
	routes: {
		'/blah' : 'page1', // Some other page
		'/setup': 'setup', // First setup
		'/admin/:page?': 'admin', // Admin pages
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
	toggleSidebar: function(e) {
		e.preventDefault();

		// Show / hide the sidebar
		var root = document.getElementById('root');
		root.classList.toggle('sidebar-open');
	},

	componentWillMount: function() {
		// Create the events object for children
		this.events.onLogin = this.onLogin;
		this.events.onLogout = this.onLogout;
		this.events.toggleSidebar = this.toggleSidebar;
		this.events.onSiteInfoUpdate = this.onSiteInfoUpdate;
		this.events.onBlogSetupCompleted = this.onBlogSetupCompleted;

		// Parse the payload into the state
		var payload = this.parsePayload();

		this.setState({
			firstSetup: payload.firstSetup,
			title: payload.site.title,
			description: payload.site.description,
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
		if (!desc) desc = this.state.description;

		this.setState({
			title: title,
			description: desc
		});
	},
	onBlogSetupCompleted: function(res) {
		this.setState({
			firstSetup: false
		});
	},

	// Router functions
	render: function() {
		return this.renderCurrentRoute();
	},
	setup: function() {
		if (!this.state.firstSetup) {
			setTimeout(function() { navigate('/'); }, 100);
			return <div>This blog has already been set up.</div>;
		}

		return (
			<div id="root">
				<header className="main-header">
					<div className="vertical">
						<Setup blog={this.state} events={this.events} />
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
				<Sidebar blog={this.state} events={this.events} />
				<div className="site-wrapper" id="site-wrapper">
					<NavBar blog={this.state} events={this.events} />
					<Header blog={this.state} events={this.events} />
					<main id="content" className="content" role="main">
						<Posts />
					</main>
					<Footer blog={this.state}/>
				</div>
			</div>
			);
	},
	admin: function(page) {
		// Redirect to the first setup page if necessary
		if (this.state.firstSetup) {
			setTimeout(function() { navigate('/setup'); }, 100);
			return <div/>;
		}

		return (
			<div id="root" className="container-fluid viewport">
				<Sidebar blog={this.state} events={this.events} />
				<NavBar blog={this.state} events={this.events} />
				<Editor blog={this.state} events={this.events} />
			</div>
			);

		/*<Sidebar blog={this.state} events={this.events} />
			<NavBar blog={this.state} events={this.events} />
		<div className="container-fluid" style={{height:'100%'}}>
			<Editor blog={this.state} events={this.events} />
			<Footer blog={this.state}/>
		</div>*/
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

ReactDOM.render(
   <RootComponent history='true' />, 
   document.body
);
