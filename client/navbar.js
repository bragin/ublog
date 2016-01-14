"use strict";

var React = require('react');
var ErrCodes = require('./errcodes');

var NavBar = React.createClass({

	render: function () {

		return <nav className="navbar navbar-light navbar-ublog">
					<div className="container-fluid">
						<button className="navbar-toggler" type="button" onClick={this.props.events.toggleSidebar}>
							<i className="fa fa-bars" />
						</button>
					</div>
				</nav>;
	}
});

module.exports = NavBar;
