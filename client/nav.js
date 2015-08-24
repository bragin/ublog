/** @jsx React.DOM */
"use strict";

var React = require('react');

var LoginBox = React.createClass({
	onLogin: function(e) {
		e.preventDefault();

		var email = this.refs.email.getDOMNode().value;
		var pass = this.refs.password.getDOMNode().value;

		this.props.blog.api.login({
			action: 'login',
			email: email,
			password: pass
		}, this.onLoginCallback)
	},

	onLoginCallback: function(err, res) {
		console.log(err, res);
	},

	render: function () {
		return (
				<form id="login" className="login-form" onSubmit={this.onLogin}>
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
					<button className="btn btn-blue login-button" type="submit">Sign in</button>
				</form>
		);
	}
});

var Navigation = React.createClass({

	render: function () {

		/* <li className="nav-{{slug}}{{#if current}} nav-current{{/if}}" role="presentation"><a href="{{url absolute="true"}}">{{label}}</a></li> */

		return (
			<div className="nav">
				<h3 className="nav-title">Menu</h3>
				<a href="#" className="nav-close" onClick={this.props.toggleMenu}>
					<span className="hidden">Close</span>
				</a>

				<LoginBox blog={this.props.blog} />
			</div>
				);
	}
});

module.exports = Navigation;
