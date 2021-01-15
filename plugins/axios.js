export default function ({ route, req, $axios, redirect, common, app, store }) {
  // console.log('axios', process.env)
  // 基本配置
  $axios.defaults.timeout = 10000
  $axios.defaults.headers.post['Content-Type'] = 'application/json'

  // 开发环境设置baseUrl
  // if (process.env.NODE_ENV.indexOf('dev') < 0) {
    $axios.defaults.baseURL = process.env.BASE_URL
  // }

  $axios.onRequest((config) => {
    return new Promise((resolve, reject) => {
      resolve(config)
    })
  })

  $axios.onResponse((res) => {
    return new Promise((resolve, reject) => {
      // console.log('response data:')
      // console.log('address url:', res.config.url)
      // console.log('requert params:', res.config.data)
      // console.log('result data:', res.data.code)

      resolve(res.data)
    })
  })

  $axios.onError(error => {
    console.log('error', error)
  })

  $axios.req = ({ url, method = 'GET', data = {}, fullData = false, headers = {}, }) => {
    const options = {
      url,
      method,
    }

    if (method === 'GET') {
      Object.assign(options, {
        params: data,
      })
    } else {
      Object.assign(options, {
        data,
      })
    }

    return new Promise((resolve, reject) => {
      $axios(options).then((res) => {
        if (fullData) resolve(res)
        else resolve(res.data)
      }).then((err) => {
        reject(err)
      })
    })
  }
}

