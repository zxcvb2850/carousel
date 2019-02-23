const path = require('path')
const rules = require('./rules')
const plugins = require('./plugins')
const devServer = require('./dev-server')

module.exports = {
    mode: 'development',
    entry: {
        main: './src/main.js',
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'static/js/[name].js'
    },
    module: { rules },
    plugins,
    devServer
}