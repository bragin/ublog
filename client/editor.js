"use strict";

var React = require('react');
var navigate = require('react-mini-router').navigate;
var marked = require("marked");

var api = require('./api');

var PostSettings = React.createClass({
	render: function() {
		return (
			<div className="settings-menu-container ember-view" id="entry-controls">
				<div id="entry-controls">
					<div className="settings-menu-pane-in settings-menu settings-menu-pane">
					<div className="settings-menu-header">
						<h4>Post Settings</h4>
						<button className="close settings-menu-header-action" onClick={this.props.onClose}><i className="fa fa-close fa-2x" /><span className="sr-only">Close</span></button>
					</div>
					<div className="settings-menu-content">
						<section className="image-uploader js-post-image-upload">
							<span className="media"><span className="sr-only">Image Upload</span></span>
							<img className="js-upload-target" style={{display: 'none'}} src />
							<div className="description">Add post image<strong /></div>
							<input name="uploadimage" className="main" type="file" />
							<div className="js-fail failed" style={{display: 'none'}}>Something went wrong :(</div>
							<button className="js-fail btn btn-green" style={{display: 'none'}}>Try Again</button>
							<a title="Add image from URL" className="image-url"><i className="fa fa-link"><span className="sr-only">URL</span></i></a>
						</section>
					<form onChange={this.props.onChange}>
						<div className="form-group">
							<label htmlFor="url">Post URL</label>
							<div className="input-group">
								<span className="input-group-addon"><i className="fa fa-link" /></span>
								<input name="post-setting-slug" id="url" className="form-control" type="text" />
							</div>
							<a href="/blah" target="_blank" className="ublog-url-preview" tabIndex="-1">ublog.io/blah/</a>
						</div>
						<div className="form-group">
							<label htmlFor="post-setting-date">Publish Date</label>
							<div className="input-group">
								<span className="input-group-addon"><i className="fa fa-calendar" /></span>
								<input name="post-setting-date" id="post-setting-date" className="form-control" type="text" />
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="tag-input">Tags</label>
							<div className="input-group">
								<span className="input-group-addon">#</span>
								<input name="post-setting-tags" id="tag-input" className="form-control" type="text" />
							</div>

						</div>

						<div className="form-group">
							<label htmlFor="author-list">Author</label>
							<div className="input-group">
								<span className="input-group-addon"><i className="fa fa-user" /></span>
								<span tabIndex="0">
									<div id="author-list">
										<select className="form-control">
											<option value={1}>Fireball</option>
										</select>
									</div>
								</span>
							</div>
						</div>

						<div className="form-group">
							<div className="checkbox">
								<label htmlFor="static-page">
									<input name="static-page" id="static-page" type="checkbox" />
									Turn this post into a static page
								</label>
							</div>
							<div className="checkbox">
								<label htmlFor="published">
									<input name="published" id="published" ref="published" type="checkbox" defaultChecked={this.props.post.published} />
									Publish this post
								</label>
							</div>
						</div>
					</form>
				</div>
			</div>
			<div className="settings-menu-pane-out-right settings-menu settings-menu-pane">
				<div></div>
			</div>
		</div>
	</div>);
	}
});

var Editor = React.createClass({
	getInitialState: function() {
		return {
			settings: false,
			updating: false,
			loading: false,
			pid: 0,
			value: 'Type some *markdown* on the left!',
			published: true
		};
	},

	componentDidMount: function() {
		// Do not reload same data if it's passed in via init property
		//if (!this.state.posts) {
			this.loadPost(this.props);
		//}
	},

	// This is needed in case URL is changed by something else than the component itself
	componentWillReceiveProps: function(newProps) {
		if (this.props.pid != newProps.pid) {
			this.loadPost(newProps);
		}
	},

	loadPost: function(props) {
		// Don't return anything if we are creating a new post
		if (props.pid == 0) {
			this.setState(this.getInitialState());
			return;
		}

		this.setState({
			loading: true
		});

		var query = {
			pid: props.pid
		};

		props.blog.api.getPosts(query, function(post) {
			if (!post) {
				this.setState({
					loading: false
				});
				return;
			}

			this.refs.source.value = post.content;
			this.refs.title.value = post.title;

			this.setState({
				loading: false,
				pid: post.pid,
				value: post.content,
				published: post.published
			});
		}.bind(this));
	},
	
	onSettingsClose: function() {
		this.setState({settings: false});
	},

	onSettingsShow: function() {
		this.setState({settings: true});
	},

	onSettingsChange: function() {
		// Update our state regarding changes in the settings
		var sts = this.refs.settings;

		this.setState({
			published: sts.refs.published.checked
		});
	},

	onUpdatePost: function() {
		// Start updating the post contents
		var title = this.refs.title.value;
		var text = this.refs.source.value;

		var post = {
			title: title,
			content: text,
			id: this.state.pid,
			published: this.state.published
		};

		this.setState({
			updating: true
		});
		api.updatePost(post, this.onUpdatePostDone);
	},

	onUpdatePostDone: function(res) {
		this.setState({
			updating: false
		});

		if (res) {
			console.log(res);
			// All good, we got a post body in reply, update it
			this.setState({
				pid: res.id,
				published: res.published,
				value: res.content
			});
		}
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
		var st = this.state;

		var loading = null;
		if (st.loading)
			loading = <div className="loaddimmer"><i className="fa fa-spinner fa-spin fa-4x" /></div>;

		var globalClass = 'post-editor';
		if (st.settings)
			globalClass += ' settings-menu-expanded';

		var actionButtonText = null;
		
		if (st.pid == 0) {
			if (st.published)
				actionButtonText = 'Create Post';
			else
				actionButtonText = 'Create Draft';
		} else {
			if (st.published)
				actionButtonText = 'Update Post';
			else
				actionButtonText = 'Update Draft';
		}

		if (this.state.updating)
			actionButtonText = <span>Saving... &nbsp;<i className="fa fa-spinner fa-spin" /></span>;

		return (
			<section className={globalClass}>
					<header className="post-editor-title">
						<h2 className="view-title">
							<input id="entry-title" ref="title" placeholder="Your Post Title" tabIndex="1" type="text" />
						</h2>
						<section className="post-actions">
							<button type="button" className="post-settings" title="Post Settings" onClick={this.onSettingsShow}>
								<i className="fa fa-cog"></i>
							</button>
							<section className="btn-group">
								<button type="button" className="btn btn-sm btn-primary" onClick={this.onUpdatePost}>
									{ actionButtonText }
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
					<PostSettings ref="settings" post={this.state} onClose={this.onSettingsClose} onChange={this.onSettingsChange} />
					{ loading }
				</section>);
	}
});

module.exports = Editor;