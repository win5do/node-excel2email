const webpack = require('webpack'); //to access built-in plugins
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
    entry: {
        main: './fe/main.js',
    },
    output: {
        path: path.resolve(__dirname, 'static'),
        filename: '[name].js'
    },
    externals: {
        jquery: 'jQuery',
    },
    module: {
        rules: [
            {test: /\.js$/, use: 'babel-loader', include: path.resolve(__dirname, 'fe')},
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!sass-loader"
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            },
        ]
    },
    plugins: [
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': JSON.stringify('production'),
        // }),

        // new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin("[name].css"),
    ]
};

module.exports = config;


if (process.env.NODE_ENV == 'prod') {
    let plugins = [
        new webpack.optimize.UglifyJsPlugin()
    ];

    config.plugins = [...config.plugins, ...plugins];
}