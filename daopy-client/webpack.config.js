const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: path.resolve(__dirname, 'daopy-client.js'),
    output: {
        path: path.resolve(__dirname, 'daopy-dist-client'),
        filename: './daopy-client.js',
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