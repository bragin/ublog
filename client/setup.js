/** @jsx React.DOM */
"use strict";

var React = require('react');
var navigate = require('react-mini-router').navigate;

var Setup = React.createClass({
	getInitialState: function() {
		return {};
	},

	onSubmit: function(e) {
		e.preventDefault();

		var email = this.refs.email.getDOMNode().value;
		var pass = this.refs.password.getDOMNode().value;

		this.props.blog.api.createUser({
			email: email,
			password: pass
		}, this.onSubmitCallback)
	},

	onSubmitCallback: function(res) {
		console.log(res);
	},

	render: function() {
		return (
				<section className="setup-box">
					<form className="setup-form" onSubmit={this.onSubmit}>
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
				);
	}
});

module.exports = Setup;