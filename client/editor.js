"use strict";

var React = require('react');
var navigate = require('react-mini-router').navigate;

var Editor = React.createClass({
	getInitialState: function() {
		return {};
	},

	render: function() {
		return (
			<section className="post-editor">
					<header className="post-editor-title">
						Post title
					</header>
					<section className="post-editor-container">

						<section className="post-editor-pane-container">
							<header className="post-editor-pane-footer">
								Footer
							</header>
							<section className="post-editor-pane-body">
								<textarea />
								Markdown editor
							</section>
						</section>

						<section className="post-preview-pane-container">
							<header className="post-editor-pane-footer">
								Footer
							</header>
							<section className="post-editor-pane-body">
								Markdown editor
							</section>
						</section>

					</section>
				</section>);
	}
});

module.exports = Editor;