/** @jsx React.DOM */
"use strict";

var React = require('react');

var Navigation = React.createClass({
	render: function() {
		return <a className="menu-button icon-menu" href="#"><span className="word">Menu</span></a>;
	}
});

// The big featured header
var Header = React.createClass({
	render: function() {

		var title = "title";
		var logo = <a className="blog-logo" href="blog.url"><img alt={title} src="blog.logo" /></a>;
		var description = "description";

		return (
			<header className="main-header">
				<nav className="main-nav overlay clearfix">
					{logo}
					<Navigation />
				</nav>
				<div className="vertical">
					<div className="main-header-content inner">
					  <h1 className="page-title">{title}</h1>
					  <h2 className="page-description">{description}</h2>
					</div>
				</div>
				<a className="scroll-down icon-arrow-left" href="#content" data-offset={-45}><span className="hidden">Scroll Down</span></a>
			</header>
		);
}
});


module.exports = Header;
