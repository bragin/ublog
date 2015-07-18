/** @jsx React.DOM */
"use strict";

var React = require('react');

// Root component
var RootComponent = React.createClass({
   render: function() {
       return <div>Hiii</div>;
   }
});

React.render( 
   <RootComponent />, 
   document.getElementById('content')
); 
