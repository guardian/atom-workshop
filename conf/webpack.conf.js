/* global module:false, __dirname:false */

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    devtool: 'source-map',
    entry: {
        app: './public/js/app.js'
    },
    output: {
        path:       path.join(__dirname, '../public/build'),
        filename:   'app.js'
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ['@babel/plugin-transform-object-assign']
                    }
                }
            },
            {
                test:    /\.js$/,
                include: [path.resolve(__dirname, "../node_modules/panda-session")],
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
              },
              {
                test: /\.scss$/,
                use: [
                  MiniCssExtractPlugin.loader,
                  {
                    loader: "css-loader",
                  },
                  "sass-loader"
                ]
            },
            {
                test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            mimetype: "application/font-woff"
                        }
                    }
                ],
                type: 'javascript/auto'
            },
            {
                test: /\.(ttf|eot|svg|gif|png)(\?v=[0-9].[0-9].[0-9])?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                }
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx', '.json', '.scss']
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'main.css',
        }),
        new webpack.ProvidePlugin({
            'Promise': 'es6-promise',
            'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
        })
    ]
};
