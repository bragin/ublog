var gulp = require('gulp');
var nodemon = require('nodemon');
var webpack = require('webpack');
var clientConfig = require('./webpack.config');
var path = require('path');

var wpCompiler = webpack(clientConfig);

function onBuild(cb) {
  return function(err, stats) {
    // Show only errors and warnings on the screen
    if (err)
      return console.log('Fatal Error: ', err);

    var jsonStats = stats.toJson();
      
    if(jsonStats.errors.length > 0) {
        console.log('Error: ', jsonStats.errors);
    }
    if(jsonStats.warnings.length > 0) {
        console.log('Warning: ', jsonStats.warnings);
    }
 
    //console.log(stats.toString());

    if (cb) cb();
  }
}

// Serverside (backend) tasks group
// Nothing so far!

// Clientside (frontend) tasks
gulp.task('client-watch', function() {
  // Changes within 100 ms = one rebuild
  wpCompiler.watch({
      aggregateTimeout: 100
    },
    onBuild());
});

gulp.task('client-build', function(cb) {
  wpCompiler.run(onBuild(cb));
});

// Group tasks

// For development - rebuilds whenever something changes
gulp.task('watch', ['client-watch']);

// For production - builds everything
gulp.task('build', ['client-build']);

// Nodemon is used. Maybe it's better to use gulp's own watch system?
gulp.task('run', ['client-watch'], function() {
  nodemon({
    execMap: {
      js: 'node'
    },
    script: path.join(__dirname, 'server/main.js'),
    ext: 'js json'
  }).on('restart', function() {
    console.log('Restarted!');
  });
});
