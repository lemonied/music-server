const { createProxyMiddleware } = require('http-proxy-middleware')
const express = require('express')
const path = require('path')
const connectHistoryApiFallback = require('connect-history-api-fallback')
const router = require('./api')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api', router)
app.use(['/cgi-bin'], createProxyMiddleware({
  target: 'https://u.y.qq.com',
  changeOrigin: true,
  secure: false,
  headers: {
    origin: 'https://y.qq.com',
    referer: 'https://y.qq.com/'
  }
}));
app.use(['/qzone', '/splcloud', '/soso', '/lyric'], createProxyMiddleware({
  target: 'https://c.y.qq.com',
  changeOrigin: true,
  secure: false,
  headers: {
    origin: 'https://y.qq.com',
    referer: 'https://y.qq.com/'
  }
}));
app.use('/', connectHistoryApiFallback())
app.use('/', express.static(path.resolve(__dirname, './webapps')))

const port = 8085

app.listen(port, 'localhost', () => {
  console.log(`Node Server Start on localhost:${port}...`)
})
