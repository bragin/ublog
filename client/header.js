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
	onScrollBtn: function(e) {

		// Don't propogate the event any further
		e.stopPropagation();

		// Very simple solution to this problem - but not fancy enough!
		//document.getElementById('content').scrollIntoView();

		// Use smooth jQuery-less scrolling (code inspired by https://github.com/Yappli/smooth-scroll/blob/main/smooth-scroll.js)
		var height_fixed_header = 0, // For layout with header with position:fixed. Write here the height of your header for your anchor don't be hiden behind
				speed = 500,
				moving_frequency = 15; // Affects performance ! High number makes scroll more smooth

		var getScrollTopElement = function(e) {
			var top = height_fixed_header * -1;
			while (e.offsetParent != undefined && e.offsetParent != null) {
				top += e.offsetTop + (e.clientTop != null ? e.clientTop : 0);
				e = e.offsetParent;
			}
			return top;
		};

		var getScrollTopDocument = function() { 
			return window.pageYOffset !== undefined ? window.pageYOffset : document.documentElement.scrollTop !== undefined ? document.documentElement.scrollTop : document.body.scrollTop;
		};

		var element = document.getElementById('content');

		var hop_count = (speed - (speed % moving_frequency)) / moving_frequency, // Always make an integer
		getScrollTopDocumentAtBegin = getScrollTopDocument(),
		gap = (getScrollTopElement(element) - getScrollTopDocumentAtBegin) / hop_count;

		for(var i = 1; i <= hop_count; i++) {
			(function() {
				var hop_top_position = gap*i;
				setTimeout(function(){  window.scrollTo(0, hop_top_position + getScrollTopDocumentAtBegin); }, moving_frequency*i);
			})();
		}
	},
	render: function() {

		var props = this.props;
		var blog = this.props.blog;

		var logo = null;
		if (blog.logo) {
			logo = <a className="blog-logo" href={blog.url}><img alt={blog.title} src={blog.logo} /></a>;
		}

		return (
			<header className="main-header">
				<nav className="main-nav overlay clearfix">
					{logo}
					<Navigation />
				</nav>
				<div className="vertical">
					<div className="main-header-content inner">
					  <h1 className="page-title">{blog.title}</h1>
					  <h2 className="page-description">{blog.description}</h2>
					</div>
				</div>
				<a className="scroll-down icon-arrow-left" href="#content" data-offset={-45} onClick={this.onScrollBtn}><span className="hidden">Scroll Down</span></a>
			</header>
		);
}
});


module.exports = Header;
