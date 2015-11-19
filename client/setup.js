"use strict";

var React = require('react');
var navigate = require('react-mini-router').navigate;

var Setup = React.createClass({
	getInitialState: function() {
		return {};
	},

	onSubmit: function(e) {
		e.preventDefault();

		var email = this.refs.email.value;
		var pass = this.refs.password.value;

		this.props.blog.api.createUser({
			email: email,
			password: pass
		}, this.onSubmitCallback)
	},

	onSubmitCallback: function(res) {
		// Navigate to the front page
		this.props.events.onBlogSetupCompleted(res);
	},

	render: function() {
		return (
				<section className="setup-box">
					<form className="form-inline" onSubmit={this.onSubmit}>
						<div className="form-group">
							<div className="input-group">
								<span className="input-group-addon"><i className="fa fa-envelope-o fa-fw"></i></span>
								<input className="form-control" autoCapitalize="off" autoCorrect="off" autoFocus="" placeholder="Email Address" ref="email" type="email" />
							</div>
						</div>
						<div className="form-group">
							<div className="input-group">
								<span className="input-group-addon"><i className="fa fa-key fa-fw"></i></span>
								<input className="form-control" placeholder="Password" ref="password" type="password" />
							</div>
						</div>
						<button className="btn btn-primary" type="submit">Own It</button>
					</form>
				</section>
				);
	}
});

module.exports = Setup;