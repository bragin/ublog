var webpack = require('webpack');
var autoprefixer = require('autoprefixer-core');
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
      {test: /\.js$/, loader: 'jsx-loader'},
      {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader","css-loader!postcss-loader", {publicPath: '/'})},
      {test: /\.(eot|svg|ttf|woff|otf)/, loader: 'file-loader?name=assets/fonts/[name].[ext]'},
      {test: /\.(png|jpg|gif)/, loader: 'file-loader?name=assets/img/[name].[ext]'}
    ]
  },
  plugins: [
     /*new webpack.DefinePlugin({
       "process.env": {
       NODE_ENV: JSON.stringify("production")
       }
     }),
     new webpack.optimize.UglifyJsPlugin(),
     new ExtractTextPlugin("./assets/css/ob.css", { allChunks: true })*/
     /*new webpack.optimize.CommonsChunkPlugin('js/common.js')*/
  ],
  postcss: [ autoprefixer({ browsers: ['last 3 version'] }) ]
};

if (process.env.NODE_ENV == "production") {
  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin());
}