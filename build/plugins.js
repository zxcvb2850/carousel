const Uglify = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = [
    new Uglify(),
    new HtmlWebpackPlugin({
        minify: {
            // 是对html文件进行压缩
            removeAttributeQuotes: true
        },
        // 为了开发中js优化错效果，所以加入hash，这样可以有效避免缓存JS
        hash: true,
        template: './index.html'
    }),
    new CopyPlugin([{
        from: './static/',
        to: './static/'
    }]),
    new ExtractTextPlugin("static/styles/styles.css")
]