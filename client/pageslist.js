"use strict";

var React = require('react'),
	marked = require('marked');

var api = require('./api'),
	df = require('./dateformat');


// Post in the list
var PageEntry = React.createClass({
	render: function() {

		var post = this.props.post;
		var postDate = new Date(post.ts * 1000);

		var dateIso = df(postDate, 'yyyy-mm-dd HH:MM');// format='YYYY-MM-DD'
		var dateHuman = df(postDate, 'dd mmm yyyy HH:MM'); // format="DD MMMM YYYY"

		return (
			<tr>
				<td>{post.id}</td>
				<td><time dateTime={dateIso}>{dateHuman}</time></td>
				<td></td>
				<td><a href={'/admin/editor/'+post.id}>{post.title}</a></td>
			</tr>
		);
}
});


var PagesList = React.createClass({
	getInitialState: function() {
		return {
			loaded: false,
			pages: []
		}
	},

	requestUpdate: function() {
		api.getPosts({limit: 100}, this.onUpdateReceived);
	},

	onUpdateReceived: function(res) {
		if (!res) return;

		console.log('Pages lists update', res);

		this.setState({
			posts: res.posts,
			loaded: true
		});
	},

	componentDidMount: function() {
		// Fetch info if it wasn't provided via init object
		this.requestUpdate();
	},

	render: function () {

		if (!this.state.loaded)
			return <div>Loading... <i className="fa fa-spinner fa-spin"/></div>;


		// Create a unordered list of pages
		var list = this.state.posts.map(function(post, idx) {
			return <PageEntry key={idx} post={post} />;
		}.bind(this));


		return (
			<div>
				<table className="table table-hover">
					<thead><tr><th>Id</th><th>Date</th><th>Lang</th><th>Title</th></tr></thead>
					<tbody>{list}</tbody>
				</table>
			</div>);
	}
});

module.exports = PagesList;
