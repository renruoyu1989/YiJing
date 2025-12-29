export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/divination/index',
    'pages/result/index',
    'pages/interpretation/index',
    'pages/settings/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#F7F5F0',
    navigationBarTitleText: '易经金钱卦',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F7F5F0'
  },
  animation: {
    duration: 0,
    delay: 0
  }
})

