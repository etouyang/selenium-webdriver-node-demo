const superagent = require('superagent');
const cheerio = require('cheerio');

//获取页面
let base = 'http://tool.manmanbuy.com/historyLowest.aspx?url=';
const coupons = async (url) => {
    return new Promise((resolve, reject) => {
        superagent.get(base+escape(url))
        .end((err, json) => {
            if(err) {
                console.log('错误:'+err)
                reject(err)
            }
            var $ = cheerio.load(json.text);
            resolve($.html())
        })
    })
}

module.exports = {coupons}