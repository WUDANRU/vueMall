// babel.config.js文件
// module.exports = {
//   presets: [
//     '@vue/cli-plugin-babel/preset'
//   ]
// }

module.exports = { //cnpm install babel-plugin-component -D
    "presets": [
        '@vue/cli-plugin-babel/preset'
    ],
    "plugins": [ //吧plugins这段按需加载的代码引入，npm run build 打包会变小，吧plugins这段按需加载的代码删除，npm run build 打包会变大
        [
            "component",
            {
                "libraryName": "element-ui",
                "styleLibraryName": "theme-chalk"
            }
        ]
    ]
}

// .babelrc新建的这个文件可以删除，因为和babel.config.js合并了

// .babelrc文件
// {
//     "presets": [["@babel/preset-env", { "modules": false }]], //修改.babelrc文件，把es2015改成@babel/preset-env
//     "plugins": [
//       [
//         "component",
//         {
//           "libraryName": "element-ui",
//           "styleLibraryName": "theme-chalk"
//         }
//       ]
//     ]
//   }