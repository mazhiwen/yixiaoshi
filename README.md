This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## 启动
```sh
yarn start
export NODE_ENV=integration
```

## babelrc

"style": true  是babel-plugin-import 按需加载antd的插件；此处屏蔽style属性，因为我们放弃插件的按需加载样式功能，在css中引入全部antd样式，并修改主题



## 主题

修改主题有另一种方式，除了，引入antd全局样式，  
还可以在webpack.config 文件css loader 的less-loader中修改主题

```javascript
{
  loader: require.resolve('less-loader'), // compiles Less to CSS
  //antd 定制主题
  options: {
    modifyVars: {
      // 'layout-header-height':'50px'
      // 'primary-color': 'red',
      // 'link-color': '#1DA57A',
      // 'border-radius-base': '2px',
    },
    javascriptEnabled: true,
  },
}
```


## 本地build调试

修改 ./config/paths.js  appBuild为  resolveApp('dist')  
修改 ./config/webpack.config.prod.js  HtmlWebpackPlugin.href 为  '/'  


## 菜单激活规则
菜单和路由严格统一，一级路由/二级路由/...级路由  
菜单分别为一二级路由，激活依据location的一二级路由正则匹配，二级路由的激活

## 新建项目配置


* 访问地址:host/contextPath/route  
修改./package.json Domain.contextPath 

* 访问地址:host/route






## 全部校验 分情况校验
当需要全部校验，并且分情况校验时，用validator 和 动态设置this.flag一起校验