const path = require('path');

module.exports = {
  mode: 'development', //DON'T USE THIS IN PRODUCTION!
  devtool: 'inline-source-map', //DON'T USE THIS IN PRODUCTION!
  entry: './src/index.ts',
  module: {
    rules: [
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
            presets: ['@babel/preset-env'],
            plugins: ["@babel/transform-gl-matrix", {
                "glMatrixArray": false
              }]
          }
        }
      },
      {
        //Typescript
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};