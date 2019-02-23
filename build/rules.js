const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path')

const JSLoader = {
    test: /\.(jsx|js)$/,
    exclude: /node_modules/,
    use: [{
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env']
        }
    }],
};
const ESLintLoader = {
    test: /\.js$/,
    enforce: 'pre',
    exclude: /node_modules/,
    // include: path.resolve(__dirname, './src/'),
    use: {
        loader: 'eslint-loader',
        options: {
            configFile: '.eslintrc.js',
            // community formatter
            formatter: require("eslint-friendly-formatter"),
        },
    }
};

const CSSLoader = {
    test: /\.(css|less)$/,
    exclude: /node_modules/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
            {
                loader: 'css-loader',
                options: { importLoaders: 1 },
            },
            {
                loader: 'postcss-loader',
                options: {
                    config: {
                        path: '.postcssrc.js'
                    }
                }
            }, {
                loader: 'less-loader'
            }],
    }),
};

module.exports = [
    JSLoader,
    ESLintLoader,
    {
        test: /\.(htm|html)$/i,
        use: ['html-withimg-loader']
    },
    CSSLoader,
    {
        test: /.(jpg|png|gif|bmp|jpeg)/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 500, //是吧小于500B的文件打包成base64的格式，写入JS
                outputPath: 'static/imgs/',//打包路径
                publicPath: '/static/imgs',
            }
        }]
    }
]