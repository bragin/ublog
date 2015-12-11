var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  cache: true,
  entry: './client/index',
  output: {
    path: 'build',
    filename: './js/app.js',
    chunkFilename: './js/app-[id].js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: 'babel', query: { presets: ['react'] }},
      {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader","css-loader!postcss-loader", {publicPath: '/'})},
      {test: /\.(eot|svg|ttf|woff|otf)/, loader: 'file-loader?name=assets/fonts/[name].[ext]'},
      {test: /\.(png|jpg|gif)/, loader: 'file-loader?name=assets/img/[name].[ext]'}
    ]
  },
  plugins: [
     new ExtractTextPlugin("./css/ublog-min.css", { allChunks: true })
  ],
  postcss: [ autoprefixer({ browsers: ['last 3 version'] }) ]
};

if (process.env.NODE_ENV == "production") {
  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin());
}