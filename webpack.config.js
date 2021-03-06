const webpack = require('webpack'); //to access built-in plugins
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
    entry: {
        app: './fe/app.js',
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
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin("[name].css"),
    ],
    devtool: "eval-source-map",
    devServer: {
        publicPath: '/static/',
        port: 9000,
        hot: true,
        overlay: true,
        proxy: {
            '/': {
                target: "http://localhost:9999",
                changeOrigin: true,
                secure: false,
            },
        }
    }
};

module.exports = config;

if (process.env.NODE_ENV == 'prod') {
    let plugins = [
        new webpack.optimize.UglifyJsPlugin()
    ];
    config.devtool = false;
    config.plugins = [...config.plugins, ...plugins];
}