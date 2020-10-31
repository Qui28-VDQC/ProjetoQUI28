const path = require('path');

module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          exclude: [
            //Comment: \\ for Windows, \/ for Mac OS and Linux
            /node_modules[\\\/]core-js/,
            /node_modules[\\\/]webpack[\\\/]buildin/,
          ],
          options: {
            presets: ['@babel/preset-env'],
            plugins: ["@babel/transform-gl-matrix", {
                "glMatrixArray": false
              }]
          }
        }
      }
    ]
};

module.exports = {
    entry: './src/Simulator.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };