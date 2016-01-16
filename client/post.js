"use strict";

var React = require('react');
var api = require('./api'),
	df = require('./dateformat');

var Post = React.createClass({
	getInitialState: function() {
		return {
			loading: false,
			pid: 0,
			title: '',
			content: ''
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
		if (this.props.id != newProps.id) {
			this.loadPost(newProps);
		}
	},

	loadPost: function(props) {
		this.setState({
			loading: true
		});

		var query = {
			pid: props.id
		};

		console.log(props.id);

		props.blog.api.getPosts(query, function(post) {
			console.log(post);
			if (!post) {
				this.setState({
					loading: false
				});
				return;
			}

			this.setState({
				loading: false,
				pid: post.id,
				title: post.title,
				value: post.content,
				published: post.published
			});
		}.bind(this));
	},

	rowMarkup: function() {
		return { __html: marked(this.state.value, {sanitize: false}) };
	},

	render: function() {
		var st = this.state;

		var loading = null;
		if (st.loading)
			loading = <div className="loaddimmer"><i className="fa fa-spinner fa-spin fa-4x" /></div>;

		return (
			<section className="">
					{ st.title }
					{ loading }
			</section>);
}
});

module.exports = Post;
