const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: path.resolve(__dirname, 'daopy.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './daopy.js',
        libraryTarget: 'commonjs2'
    },
    mode:"production",
    plugins: [
        new webpack.LoaderOptionsPlugin({
          // test: /\.xxx$/, // may apply this only for some modules
          options: {
            languageOut: "es6"
          }
        })
      ]
}