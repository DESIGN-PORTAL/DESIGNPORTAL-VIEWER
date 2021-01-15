export default {
  env: {
    baseUrl: process.env.BASE_URL,
    nodeEnv: process.env.NODE_ENV,
  },
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'H5Viewer',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: '"width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover, user-scalable=0' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/axios',
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: process.env.NODE_ENV.indexOf('dev') !== -1 ? true : false,
    prefix: '/api'
  },
  // 代理服务器
  // process.env.BASE_URL
  // proxy: {
  //   '/api': {
  //     target: process.env.BASE_URL,
  //     changeOrigin: true,
  //     pathRewrite: {
  //       // '^/api': '',
  //     },
  //   },
  // },
  router: {
    base: process.env.NODE_ENV === 'dev' ? '' : '/viewer/',
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    
  }
}
