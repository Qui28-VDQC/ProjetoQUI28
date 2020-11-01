const path = require('path');

module.exports = {
  mode: 'development', //DON'T USE THIS IN PRODUCTION!
  devtool: 'source-map', //DON'T USE THIS IN PRODUCTION!
  entry: './src/index.ts',
  module: {
    rules: [
      {
        //Typescript
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      { 
        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        test: /\.js$/, 
        loader: "source-map-loader" 
      }
    ],
  },
  resolve: {
    extensions: [ ".webpack.js", ".web.js", ".ts", ".tsx", ".js" ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};