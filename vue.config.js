const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

// Generate pages object
const pagesObj = {};

const chromeName = ["popup", "options"];

chromeName.forEach(name => {
  pagesObj[name] = {
    entry: `src/${name}/index.ts`,
    template: `src/${name}/index.html`,
    filename: `${name}.html`
  };
});

const copyFiles = [
    {
      from: path.resolve("src/manifest.production.json"),
      to: `${path.resolve("dist")}/manifest.json`
    },
    {
        from: path.resolve("src/assets"),
        to: path.resolve("dist/assets")
    }
];

// 开发环境将热加载文件复制到dist文件夹
if (process.env.NODE_ENV !== 'production') {
  copyFiles.push(
    {
      from: path.resolve("src/utils/hot_reload.js"),
      to: path.resolve("dist")
    }
  )
}

module.exports = {
  pages: pagesObj,
  configureWebpack: {
    plugins: [CopyWebpackPlugin(copyFiles)],
    entry: {
      'content': './src/content/index.js',
      'background': './src/background/index.js',
    },
    output: {
      filename: 'js/[name].js'
    },
  },
  css: {
    extract: {
      filename: 'css/[name].css'
    }
  }
};
