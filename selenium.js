//npm install chromedriver
const {Builder, By, Key, until, Capabilities} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const options = new chrome.Options();
options.addArguments('--headless');
options.addArguments('--no-sandbox');
options.addArguments('--disable-gpu');

const base = 'http://tool.manmanbuy.com/historyLowest.aspx?url='

async function sleep(timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        resolve();
      }, timeout);
    });
  }

const loading = async (broswer, element) => {
    let loader = await element.getText()
    if (loader == '正在加载中，请稍后...') {
        await sleep(500)
        return await loading(broswer, element)
    } else if (loader == '暂未收录') {
        return Promise.resolve('暂未收录')
    } else {
        let resultElement = await broswer.findElement(By.className('note'))
        let titleElement = await broswer.findElement(By.className('tit'))
        let title = await titleElement.getText()
        let res = await resultElement.getText()
        if (res.indexOf(' ')>=0) {
            let price = res.split(' ')[0].replace('查询结果：', '')
            return Promise.resolve({title, price})
        }
    }
}

const coupons = async (broswer) => {
    let couponElement = await broswer.findElement(By.className('trend_page'))
    let hasUl = await couponElement.getText()
    if(hasUl) {
        let ul = await couponElement.findElement(By.tagName('ul'))
        let lis = await ul.findElements(By.tagName('li'))
        let tempPromise = new Promise((resolve, reject) => {
            let temp = []
            let reg = /\n/g
            lis.forEach(async li => {
                let text = await li.getText()
                let string = text.replace(reg, ' ')
                temp.push(string)
                if(temp.length == lis.length) {
                    resolve(temp)
                }
            })
        })
        let titles = await tempPromise
        return Promise.resolve(titles)
    }
    return Promise.resolve([])
}

const start = async (url) => {

    let broswer = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    await broswer.get(base + escape(url))

    let coupon = await coupons(broswer)

    broswer.switchTo().frame('iframeId')

    let containerElement = await broswer.findElement(By.id('container'))
    let loader = await containerElement.getText()

    let resObj = await loading(broswer, containerElement)
    broswer.close()
    broswer.quit()
    return Promise.resolve({...resObj, coupon})
}
module.exports = {start}



