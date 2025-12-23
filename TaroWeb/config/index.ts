import type { UserConfigExport } from '@tarojs/cli'

export default {
  projectName: 'taro-iching',
  date: '2025-12-21',
  designWidth: 375,
  deviceRatio: {
    375: 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  alias: {
    '@': require('path').resolve(__dirname, '..', 'src')
  },
  framework: 'vue3',
  compiler: {
    type: 'webpack5',
    prebundle: {
      enable: false
    }
  },
  cache: {
    enable: true
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false
      }
    }
  },
  h5: {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    staticDirectory: 'static',
    devServer: {
      client: {
        overlay: false
      }
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false
      }
    }
  }
} satisfies UserConfigExport
