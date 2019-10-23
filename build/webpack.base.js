const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.vue', '.less'],
    alias: {
      // vue: 'vue/dist/vue.js',
      'src': path.resolve(__dirname, '../src'),
      'example': path.resolve(__dirname, '../example'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              // compilerOptions: {
              //   preserveWhitespace: false
              // }
            }
          }
        ]
      },
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          // enable sub-packages to find babel config
          options: {
            // rootMode: 'upward'
            presets: [
              '@babel/preset-env',
              [
                '@babel/preset-typescript',   // 引用Typescript插件
                {
                  allExtensions: true,        // 支持所有文件扩展名
                },
              ],
            ],
          }
        },
      },
      {
        test: /\.less$/,
        sideEffects: true,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              paths: [path.resolve(__dirname, 'node_modules')]
            }
          }
        ]
      }
    ]
  },
  plugins: [new VueLoaderPlugin()]
};

