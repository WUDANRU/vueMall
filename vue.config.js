const path = require('path')
const webpack = require('webpack')
const UglifyPlugin = require('uglifyjs-webpack-plugin') //打包时候去掉console.log与debugger调试
const CompressionPlugin = require("compression-webpack-plugin") //启用 gzip压缩,(build 之后dist文件里面会有.gz文件)

module.exports = {
    publicPath: './', // 基本路径
    outputDir: 'dist', // 输出文件目录
    filenameHashing: true, // 生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存
    lintOnSave: false, // eslint-loader 是否在保存的时候检查
    productionSourceMap: true, // 生产环境是否生成 sourceMap 文件

    chainWebpack: config => { //chainWebpack放了loader,更改和添加loader
        // 开启图片压缩
        config.module.rule('images')
            .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
            .use('url-loader')
            .loader('url-loader')
            .options({
                limit: 10240 // 图片小于10k转为base64,默认4k
            })
            .end()
            .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
            .options({ bypassOnDebug: true })
            .end()

        const cdn = {
            // 访问https://unpkg.com/element-ui/lib/theme-chalk/index.css获取最新版本
            css: ["//unpkg.com/element-ui@2.10.1/lib/theme-chalk/index.css"],
            js: [ //externals的vue,vue-router,vuex,axios,element-ui
                    "//unpkg.com/vue@2.6.10/dist/vue.min.js", // 访问https://unpkg.com/vue/dist/vue.min.js获取最新版本
                    "//unpkg.com/vue-router@3.0.6/dist/vue-router.min.js",
                    "//unpkg.com/vuex@3.1.1/dist/vuex.min.js",
                    "//unpkg.com/axios@0.19.0/dist/axios.min.js",
                    "//unpkg.com/element-ui@2.13.2/lib/index.js"
                ]
                //   "//unpkg.com/element-ui@2.10.1/lib/index.js"
        };

        // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
        config.plugin("html").tap(args => {
            // html中添加cdn

            args[0].cdn = cdn;

            // 修复 Lazy loading routes Error
            args[0].chunksSortMode = "none";

            return args;
        });
        // 配置Jquery
        config.plugin('provide').use(webpack.ProvidePlugin, [{
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default']
        }]);

        // 开启js、css 文件的 gzip 压缩。
        // 注意，gzip 压缩需要后端配合使用。如果后端没有开发 gzip 。请关闭功能。
        // 更多相关知识请查阅： https://blog.csdn.net/weixin_44869002/article/details/106717640
        if (process.env.NODE_ENV === 'production') {
            config.plugin('compressionPlugin')
                .use(new CompressionPlugin({
                    test: /\.js$|\.html$|.\css/, // 匹配文件名
                    threshold: 10240, // 对超过10k的数据压缩
                    deleteOriginalAssets: false // 不删除源文件
                }))
        }
    },

    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') { //  configureWebpack放了插件
            // 为生产环境修改配置...
            config.mode = 'production'

            // 将每个依赖包打包成单独的js文件
            const optimization = {
                runtimeChunk: 'single',
                splitChunks: {
                    chunks: 'all',
                    maxInitialRequests: Infinity,
                    minSize: 20000, // 依赖包超过20000bit将被单独打包
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            name(module) {
                                // get the name. E.g. node_modules/packageName/not/this/part.js
                                // or node_modules/packageName
                                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                                    // npm package names are URL-safe, but some servers don't like @ symbols
                                return `npm.${packageName.replace('@', '')}`
                            }
                        }
                    }
                },

                // 移除console
                minimizer: [new UglifyPlugin({
                    uglifyOptions: {
                        warnings: false,
                        compress: {
                            drop_console: true, // console
                            drop_debugger: false,
                            pure_funcs: ['console.log'] // 移除console
                        }
                    }
                })]
            }
            Object.assign(config, {
                optimization
            })
        } else {
            // 为开发环境修改配置...
            config.mode = 'development'
        }

        // Object.assign(config, {
        //     // 开发生产共同配置
        //     resolve: {
        //         alias: {
        //             // '@': path.resolve(__dirname, './src'),
        //             // '@c': path.resolve(__dirname, './src/components'),
        //             // '@p': path.resolve(__dirname, './src/pages'),
        //             // '@v': path.resolve(__dirname, './src/views'),
        //         } // 别名配置
        //     }
        // })



        // 用cdn方式引入,这5个不打包
        config.externals = { //externals优化
            vue: "Vue",
            "element-ui": "ELEMENT",
            "vue-router": "VueRouter",
            vuex: "Vuex",
            axios: "axios"
        };
    },

    // css相关配置
    css: {
        extract: true, // 是否使用css分离插件 ExtractTextPlugin(提取打包的css文件夹)
        sourceMap: true, // 开启 CSS source maps?
        requireModuleExtension: true, // 是否仅对文件名包含module的css相关文件使用 CSS Modules
        loaderOptions: {
            css: {
                modules: {
                    localIdentName: '[local]_[hash:base64:8]' // 设定 CSS Modules 命名规则
                }
            },
            scss: {
                // 向全局sass样式传入共享的全局变量, $src可以配置图片cdn前缀
                // 详情: https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
                // prependData: `
                //   @import "@scss/base.scss";
                //   @import "@scss/button.scss";
                //   @import "@scss/config.scss";
                //   @import "@scss/mixin.scss";
                //   @import "@scss/modal.scss";
                //   @import "@scss/reset.scss";
                //   $src: "${process.env.VUE_APP_BASE_API}";
                //   `
                prependData: `
                @import "./src/assets/scss/base.scss";
                @import "./src/assets/scss/config.scss";
                @import "./src/assets/scss/mixin.scss";
                @import "./src/assets/scss/modal.scss";
                @import "./src/assets/scss/reset.scss";
                `
                    // 对于这个@import "./src/assets/scss/button.scss";应该是局部的，不是全局的
            }
        },
        // css预设器配置项 详见https://cli.vuejs.org/zh/config/#css-loaderoptions
    },
    parallel: require('os').cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
    // webpack-dev-server 相关配置
    devServer: {
        host: 'localhost', // 主机
        port: 8080, // 端口
        proxy: { // 代理，访问了/a接口，实际上代理了/b,实际上访问的是/b接口
            '/api': { // 拦截到了虚拟/api接口，代理了慕课接口
                target: 'http://mall-pre.springboot.cn', //target: 'https://www.imooc.com',
                //1  changeOrigin: false,  报错，Uncaught SyntaxError: Unexpected token < 然后接口的数据显示空白或者404(指的是network的js-
                //2  点击左侧的接口http://localhost:8080/u/loading?callback=__jp0-点击Preview)     404说明接口没有访问到

                changeOrigin: true, //是否将目标头更改为目标的url地址
                pathRewrite: { // 转发地址
                    '/api': '',
                }
            }
        }
    },
    // 第三方插件配置
    pluginOptions: {}
}