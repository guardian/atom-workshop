/* global module:false, __dirname:false */


const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'inline-source-map',
    context: resolve(__dirname, '..', 'public'),
    entry: [
      'react-hot-loader/patch',
      'webpack/hot/only-dev-server',
      './js/app.js'
    ],
    output: {
      filename: 'app.js',
      path: resolve(__dirname, '..', 'public', 'build'),
      publicPath: 'https://atomworkshop.local.dev-gutools.co.uk/assets/build/'
    },

    devServer: {
      hot: true,
      contentBase: resolve(__dirname, '..', 'public', 'build'),
      publicPath: 'https://atomworkshop.local.dev-gutools.co.uk/assets/build/',
      port: 9051,
      public: "atomworkshop.local.dev-gutools.co.uk"
    },

    module: {
        loaders: [
            {
                test:    /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            },
            {
                test:    /\.js$/,
                include: [resolve(__dirname, "../node_modules/panda-session")],
                loaders: ['babel-loader']
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']

            },
            {
                test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/,
                loader: "url-loader?mimetype=application/font-woff&limit=10000"
            },
            {
                test: /\.(ttf|eot|svg|gif|png)(\?v=[0-9].[0-9].[0-9])?$/,
                loader: "file-loader?name=[name].[ext]"
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx', '.json', '.scss']
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
};
