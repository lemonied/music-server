const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

;(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args:[
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
      '--lang=zh-CN,zh;q=0.5'
    ]
  })
  const page = await browser.newPage()
  page.on('load', async () => {
    await page.evaluate(async () => {
      const loginBtn = document.getElementsByClassName('top_login__link')[0]
      if (loginBtn) {
        loginBtn.click()
      }
    })
  })
  page.on('frameattached', async () => {
    const preloadFile = fs.readFileSync(path.resolve(__dirname, './preload.js'), 'utf8')
    const argv = process.argv;
    const username = argv[argv.length - 2]
    const password = argv[argv.length - 1]
    await page.evaluateOnNewDocument(
      preloadFile.replace('$username$', username).replace('$password$', password)
    )
  })
  page.on('console', async msg => {
    for (let i = 0; i < msg.args().length; ++i) {
      const content = msg.args()[i].toString()
      if (content === 'JSHandle:slide') {
        await tryToSlide(page)
      }
    }
  })
  page.on('error', error => {
    process.send({
      result: 0,
      error
    })
  })

  let getUserInfo
  let getFavorites
  page.on('response', async res => {
    const url = res.url()
    // 我喜欢的
    if (/\/qzone\/fcg-bin\/fcg_ucc_getcdinfo_byids_cp\.fcg/.test(url) && !getFavorites) {
      getFavorites = url
    }
    // 获取个人信息
    if (/\/cgi-bin\/musicu\.fcg\?g_tk=/.test(url) && !getUserInfo) {
      getUserInfo = url
    }
    if (getUserInfo && getFavorites) {
      process.send({
        result: 1,
        data: {
          getUserInfo,
          getFavorites,
          cookies: await page.cookies()
        }
      })
      process.exit(1)
    }
  })
  await page.goto('https://y.qq.com/portal/profile.html', {
    waitUntil: 'domcontentloaded'
  })
})()

function sleep(delay = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay)
  })
}

const startX = 360
async function tryToSlide(page, x = startX) {
  await sleep(1500)
  if (page.mouse) {
    await page.mouse.move(192, 377)
    await page.mouse.down()
    await page.mouse.move(x, 377)
    await page.mouse.up()
    if (x < startX + 25) {
      await tryToSlide(page, x + 5)
    }
  }
}
