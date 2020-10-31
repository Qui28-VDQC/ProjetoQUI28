const path = require('path');

module.exports = {
  mode: 'development', //DON'T USE THIS IN PRODUCTION!
  devtool: 'inline-source-map', //DON'T USE THIS IN PRODUCTION!
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
        //Babel
        test: /\.m?js$/,
        exclude: [
          //Comment: \\ for Windows, \/ for Mac OS and Linux
          /(node_modules|bower_components)/,          
          /node_modules[\\\/]core-js/,
          /node_modules[\\\/]webpack[\\\/]buildin/,
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript'],
            plugins: ["@babel/transform-gl-matrix", {
                "glMatrixArray": false
              }]
          }
        }
      },
      { 
        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        test: /\.js$/, 
        loader: "source-map-loader" 
      }
    ],
  },
  resolve: {
    extensions: [ "", ".webpack.js", ".web.js", ".ts", ".tsx", ".js" ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};