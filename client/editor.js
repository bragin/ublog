"use strict";

var React = require('react');
var navigate = require('react-mini-router').navigate;
var marked = require("marked");

var Editor = React.createClass({
	getInitialState: function() {
		return {
			value: 'Type some *markdown* here!'
		};
	},

	onSourceTextChange: function(e) {
		this.setState({value: this.refs.source.value});
	},

	onSourceTextScroll: function(e) {
		var src = e.target;
		var preview = this.refs.previewContainer;

		// End of scroll: element.scrollHeight - element.scrollTop === element.clientHeight

		var r1 = preview.scrollHeight - preview.clientHeight;
		var r2 = src.scrollHeight - src.clientHeight;

		var perc = src.scrollTop / r2;

		preview.scrollTop = (preview.scrollHeight - preview.clientHeight) * perc;
	},

	rowMarkup: function() {
		return { __html: marked(this.state.value, {sanitize: false}) };
	},

	render: function() {
		return (
			<section className="post-editor">
					<header className="post-editor-title">
						<h2 className="view-title">
							<input id="entry-title" placeholder="Your Post Title" tabIndex="1" type="text" />
						</h2>
						<section className="post-actions">
							<button type="button" className="post-settings" title="Post Settings">
								<i className="fa fa-cog"></i>
							</button>
							<section className="btn-group">
								<button type="button" className="btn btn-sm btn-primary">
									Update Post
								</button>

								<button role="button" className="btn btn-sm btn-primary  dropdown-toggle up">
									<i className="options icon-arrow2"></i>
									<span className="sr-only">Toggle Settings Menu</span>
								</button>
							</section>
						</section>
					</header>

					<section className="post-editor-container">
						<section className="post-editor-pane-container">
							<header className="post-editor-pane-footer">
								Footer
							</header>
							<section className="post-editor-pane-body">
								<textarea ref="source" onChange={this.onSourceTextChange} onScroll={this.onSourceTextScroll}/>
							</section>
						</section>

						<section className="post-preview-pane-container">
							<header className="post-editor-pane-footer">
								Footer
							</header>
							<section className="post-editor-pane-body entry-preview-content" ref="previewContainer">
								<div className="rendered-markdown" ref="preview" dangerouslySetInnerHTML={this.rowMarkup()} />
							</section>
						</section>

					</section>
				</section>);
	}
});

module.exports = Editor;