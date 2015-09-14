/** @jsx React.DOM */
"use strict";

var React = require('react');
var ErrCodes = require('./errcodes');

var LoginBox = React.createClass({
	getInitialState: function() {
		return {
			errEmail: false, // highlighting the fields
			errPassword: false
		}
	},

	onLogin: function(e) {
		e.preventDefault();

		// Reset error highlights
		this.setState({
			errEmail: false,
			errPassword: false
		});

		var email = this.refs.email.getDOMNode().value;
		var pass = this.refs.password.getDOMNode().value;

		this.props.blog.api.login({
			action: 'login',
			email: email,
			password: pass
		}, this.onLoginCallback)
	},

	onLoginCallback: function(res) {
		if (res.err == ErrCodes.UserNotFound) this.setState({ errEmail: true });
		if (res.err == ErrCodes.InvalidPassword) this.setState({ errPassword: true });

		this.props.events.onLogin(res);
	},

	onLogout: function(e) {
		e.preventDefault();

		this.props.blog.api.login({
			action: 'logout'
		}, this.onLogoutCallback)
	},

	onLogoutCallback: function(err) {
		this.props.events.onLogout();
	},

	render: function () {
		var loginBox = null;

		if (this.props.blog.user) {
			loginBox = <form id="login" className="login-form" onSubmit={this.onLogout}>
					<button className="btn btn-blue login-button" type="submit">Sign out</button>
				</form>;
		} else {
			// Highlight boxes with invalid data
			var classEmail = 'form-group';
			var classPassword = 'form-group';

			if (this.state.errEmail) classEmail += ' has-error';
			if (this.state.errPassword) classPassword += ' has-error';

			loginBox = (
				<form onSubmit={this.onLogin}>
					<div className={classEmail}>
						<div className="input-group">
							<span className="input-group-addon"><i className="fa fa-envelope-o fa-fw"></i></span>
							<input className="form-control form-control-sm" autoCapitalize="off" autoCorrect="off" autoFocus="" placeholder="Email Address" ref="email" type="email" />
						</div>
					</div>
					<div className={classPassword}>
						<div className="input-group">
							<span className="input-group-addon"><i className="fa fa-key fa-fw"></i></span>
							<input className="form-control form-control-sm" placeholder="Password" ref="password" type="password" />
						</div>
					</div>
					<button className="btn btn-sm btn-primary" type="submit">Sign in</button>
				</form>);
		}

		return loginBox;
	}
});

var Sidebar = React.createClass({

	render: function () {

		/* <li className="nav-{{slug}}{{#if current}} nav-current{{/if}}" role="presentation"><a href="{{url absolute="true"}}">{{label}}</a></li> */

		/*return (
			<div className="nav">
				<h3 className="nav-title">Menu</h3>
				<a href="#" className="nav-close" onClick={this.props.events.toggleMenu}>
					<span className="hidden">Close</span>
				</a>

				<LoginBox blog={this.props.blog} events={this.props.events} />
			</div>
				);*/

		var blog = this.props.blog;
		var items = [];

		// Put admin stuff into the menu items list
		if (blog.user && blog.user.permissions.owner) {
			items.push(<li key={1}><a href="/admin/editor"><i className="fa fa-pencil fa-fw"></i>&nbsp; New Post</a></li>);
		}


		return <div id="sidebar-wrapper">
					<ul className="sidebar-nav">
						<li className="sidebar-brand">
							<a href="#">
								Menu
							</a>
						</li>
						{ items }
						<li>
							<LoginBox blog={this.props.blog} events={this.props.events} />
						</li>
					</ul>

				</div>;
	}
});

module.exports = Sidebar;
