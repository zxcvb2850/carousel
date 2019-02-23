const path = require('path')

module.exports = {
    stats: 'minimal',
    // 设置基本目录结构
    contentBase: path.resolve(__dirname, '../dist'),
    // 服务器的IP地址，可以使用IP也可以使用localhost
    host: '0.0.0.0',
    // 服务器压缩是否开启
    compress: true,
    // 配置服务端口
    port: 3000,
}