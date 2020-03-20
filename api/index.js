const express = require('express')
const router = express.Router()
const cp = require('child_process')
const path = require('path')

function login(username, password) {
  return new Promise((resolve, reject) => {
    const child = cp.fork(path.resolve(__dirname, '../simulated'), [username, password])

    child.on('message', msg => {
      if (msg.result === 1) {
        resolve(msg.data)
      } else {
        reject(msg.error)
      }
      child.kill(1)
      clearTimeout(interval)
    })
    const interval = setTimeout(() => {
      reject(new Error('Timeout'))
      child.kill(1)
    }, 30000)
  })
}

router.post('/login', (req, res, next) => {
  const {username, password} = req.body
  if (!username || !password) {
    return res.send({
      result: 0,
      errMsg: '参数错误'
    })
  }
  login(username, password).then(data => {
    res.send({
      result: 1,
      data: data
    })
  }).catch(error => {
    res.send({
      result: 0,
      errMsg: error.message
    })
  })
})

module.exports = router
