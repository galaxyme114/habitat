module.exports = {
  pwa: {
    name: 'Habitat',
    themeColor: '#f26b6b',
    msTileColor: '#bcdfdd',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'GenerateSW',
    iconPaths: {
      favicon32: 'icons/favicon-32x32.png',
      favicon16: 'icons/favicon-16x16.png',
      appleTouchIcon: 'icons/apple-touch-icon-152x152.png',
      maskIcon: 'icons/safari-pinned-tab.svg',
      msTileImage: 'icons/msapplication-icon-144x144.png'
    },
    manifestOptions: {
      icons: [
        {
          src: './icons/favicon-196x196.png',
          sizes: '196x196',
          type: 'image/png'
        },
        {
          src: './icons/mstile-310x310.png',
          sizes: '310x310',
          type: 'image/png'
        },
        {
          src: './icons/favicon-196x196.png',
          sizes: '196x196',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: './icons/mstile-310x310.png',
          sizes: '310x310',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    }
  }
}
