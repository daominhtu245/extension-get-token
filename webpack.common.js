const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const dotenv = require('dotenv').config({
    path: path.join(__dirname, '.env')
})

module.exports = {
    entry: {
        popup: "./src/script/popup.js",
        background: "./src/script/background.js"
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    mangle: {
                        toplevel: true,
                        properties: {
                            regex: /^__/
                        },
                    },
                    compress: {
                        drop_console: true,
                    },
                },
            })
        ],
    },
    plugins: [
        new webpack.DefinePlugin({'project.env.NODE_ENV': JSON.stringify(dotenv.parsed)}),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './public/manifest.json',
                    to: 'manifest.json',
                    transform: function(content, path) {
                        const manifest = JSON.parse(content.toString('utf8'));
                        manifest.version = process.env.npm_package_version;
                        return JSON.stringify(manifest, null, 2);
                    }
                },
                {
                    from: './public/favicon.png',
                    to: 'favicon.png',
                },
                {
                    from: './public/popup.html',
                    to: 'popup.html',
                },
                {
                    from: './public/style/**/*',
                    to: '',
                }
            ]
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'loader.js',
                    },
                ]
            }
        ],

    },
    resolveLoader: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'loaders')
        ]
    }
};
