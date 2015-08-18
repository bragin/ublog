/** @jsx React.DOM */
"use strict";

var React = require('react');

var Navigation = React.createClass({

	onLogin: function(e) {
		console.log('onLogin');
		e.preventDefault();
	},

	render: function () {

		/* <li className="nav-{{slug}}{{#if current}} nav-current{{/if}}" role="presentation"><a href="{{url absolute="true"}}">{{label}}</a></li> */

		return (
			<div className="nav">
				<h3 className="nav-title">Menu</h3>
				<a href="#" className="nav-close" onClick={this.props.toggleMenu}>
					<span className="hidden">Close</span>
				</a>

				<form id="login" className="login-form" onSubmit={this.onLogin}>
					<div className="email-wrap">
						<span className="icon input-icon icon-mail">
							<input className="email" autocapitalize="off" autocorrect="off" autofocus="" placeholder="Email Address" name="identification" type="email" />
						</span>
					</div>
					<div className="password-wrap">
						<span className="icon input-icon icon-lock">
							<input className="password" placeholder="Password" name="password" type="password" />
						</span>
					</div>
					<button className="btn btn-blue login-button" type="submit">Sign in</button>
				</form>
			</div>);
	}
});

module.exports = Navigation;
