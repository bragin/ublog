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
			var classEmail = 'email-wrap';
			var classPassword = 'password-wrap';

			if (this.state.errEmail) classEmail += ' danger-outline';
			if (this.state.errPassword) classPassword += ' danger-outline';

			loginBox = (
				<form id="login" className="login-form" onSubmit={this.onLogin}>
					<div className={classEmail}>
						<span className="icon input-icon icon-mail">
							<input className="email" autoCapitalize="off" autoCorrect="off" autoFocus="" placeholder="Email Address" ref="email" type="email" />
						</span>
					</div>
					<div className={classPassword}>
						<span className="icon input-icon icon-lock">
							<input className="password" placeholder="Password" ref="password" type="password" />
						</span>
					</div>
					<button className="btn btn-blue login-button" type="submit">Sign in</button>
				</form>);
		}

		return loginBox;
	}
});

var Navigation = React.createClass({

	render: function () {

		/* <li className="nav-{{slug}}{{#if current}} nav-current{{/if}}" role="presentation"><a href="{{url absolute="true"}}">{{label}}</a></li> */

		return (
			<div className="nav">
				<h3 className="nav-title">Menu</h3>
				<a href="#" className="nav-close" onClick={this.props.events.toggleMenu}>
					<span className="hidden">Close</span>
				</a>

				<LoginBox blog={this.props.blog} events={this.props.events} />
			</div>
				);
	}
});

module.exports = Navigation;
