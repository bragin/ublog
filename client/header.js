/** @jsx React.DOM */
"use strict";

var React = require('react');

// The big featured header
var Header = React.createClass({

	saveTimer: null,

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

	saveChanges: function() {
		var blog = this.props.blog;
		var api = blog.api;

		// Get data to determine what changed
		var titleNode = this.refs.pageTitle.getDOMNode();
		var descNode = this.refs.pageDesc.getDOMNode();
		var title = titleNode.value;
		var desc = descNode.value;

		if (blog.title == title) title = null;
		if (blog.description == desc) desc = null;

		if (!title && !desc) return;

		if (title) titleNode.classList.add('saving');
		if (desc) descNode.classList.add('saving');

		api.setSiteInfo({title: title, desc: desc}, this.saveChangesCompleted);
	},

	saveChangesCompleted: function(res) {
		var titleNode = this.refs.pageTitle.getDOMNode();
		var descNode = this.refs.pageDesc.getDOMNode();
		titleNode.classList.remove('saving');
		descNode.classList.remove('saving');

		// Propogate the new site object to the root component
		if (res) this.props.events.onSiteInfoUpdate(res);

		// Rerender won't happen because textareas are not managed by React. So update them ourselves
		if (res.title) titleNode.value = res.title;
		if (res.desc) descNode.value = res.desc;
	},

	onFocusBlogTitle: function(e) {
		//console.log('onFocus');
	},

	onBlurBlogTitle: function(e) {
		// Clear the timer because we're going to save right away
		if (this.saveTimer) clearTimeout(this.saveTimer);
		this.saveChanges();
	},

	onInfoKeyPress: function(e) {
		if (this.saveTimer) clearTimeout(this.saveTimer);
		this.saveTimer = setTimeout(this.saveChanges, 1000);
	},

	render: function() {

		var props = this.props;
		var blog = this.props.blog;

		var logo = null;
		if (blog.logo) {
			logo = <a className="blog-logo" href={blog.url}><img alt={blog.title} src={blog.logo} /></a>;
		}

		var nav = null;
		if (true) {
			nav = <nav className="main-nav overlay clearfix">
					{logo}
					<a className="menu-button icon-menu" href="#" onClick={this.props.events.toggleMenu}><span className="word">Menu</span></a>
				</nav>;
		}

		var blogTitle = <h1 className="page-title">{blog.title}</h1>;
		var blogDesc = <h2 className="page-description">{blog.description}</h2>;

		if (blog.user && blog.user.permissions.owner) {
			blogTitle = <textarea className="page-title-edit"
								ref="pageTitle" rows={1} autoComplete="off" defaultValue={blog.title}
								onFocus={this.onFocusBlogTitle}
								onBlur={this.onBlurBlogTitle}
								onKeyPress={this.onInfoKeyPress}/>;
			blogDesc = <textarea className="page-description-edit"
								ref="pageDesc" rows={1} autoComplete="off" defaultValue={blog.description}
								onFocus={this.onFocusBlogTitle}
								onBlur={this.onBlurBlogTitle}
								onKeyPress={this.onInfoKeyPress} />;
		}

		return (
			<header className="main-header">
				{nav}
				<div className="vertical">
					<div className="main-header-content inner">
					  {blogTitle}
					  {blogDesc}
					</div>
				</div>
				<a className="scroll-down icon-arrow-left" href="#content" data-offset={-45} onClick={this.onScrollBtn}><span className="hidden">Scroll Down</span></a>
			</header>
		);
	}
});


module.exports = Header;
