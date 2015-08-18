/** @jsx React.DOM */
"use strict";

var React = require('react');

var Navigation = React.createClass({
	render: function () {

		/* <li className="nav-{{slug}}{{#if current}} nav-current{{/if}}" role="presentation"><a href="{{url absolute="true"}}">{{label}}</a></li> */

		return (
			<div className="nav">
				<h3 className="nav-title">Menu</h3>
				<a href="#" className="nav-close" onClick={this.props.toggleMenu}>
					<span className="hidden">Close</span>
				</a>
				<ul>
					<li className="nav-slug nav-current" role="presentation"><a href="/url/absolute}">label 1</a></li>
					<li className="nav-slug" role="presentation"><a href="/url/absolute}">label 2</a></li>
				</ul>
				<a className="subscribe-button icon-feed" href={this.props.blog.url+'/rss/'}>Subscribe</a>
			</div>);
	}
});

module.exports = Navigation;
