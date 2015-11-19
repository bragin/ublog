"use strict";

var React = require('react');

// The big featured header
var Footer = React.createClass({
	render: function() {

		var props = this.props;
		var blog = this.props.blog;

		var dtFormatted = '2015'; // date format="YYYY"

		return (
        <footer className="site-footer clearfix">
            <section className="copyright"><a href={blog.url}>{blog.title}</a> &copy; {dtFormatted}</section>
            <section className="poweredby">Powered by <a href="https://ublog.io">UBlog</a></section>
        </footer>
		);
}
});


module.exports = Footer;
