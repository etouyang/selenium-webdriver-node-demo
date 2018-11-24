const superagent = require('superagent');
const dateFormat = require('dateformat');
const base = 'https://bijiatool-v2.manmanbuy.com/ChromeWidgetServices/WidgetServices.ashx?jsoncallback='
const request = async (url, page) => {
    return new Promise((resolve, reject) => {
        superagent.get(base)
        .query({
            "methodName": "getZhekou",
            "p_url": escape(url),
            "ipagesize": 10,
            "ipage": page
        })
        .end((err, json) => {
            if(err) {
                console.log('错误:'+err)
                reject(err)
            }
            let res = JSON.parse(json.text)
            if(res.zklist.length) {
                let reg1 = /<p>/g
                let reg2 = /<\/p>/g
                res.zklist = res.zklist.map(item => {
                    let time = item.dt.replace('/Date(', ' ').replace(')/', ' ')
                    let date = new Date(parseInt(time))
                    date = dateFormat(date, "isoDate");
                    item.dt = date
                    let spprice = item.spprice.replace(reg1, '').replace(reg2, '')
                    item.spprice = spprice
                    return item
                })
            }
            resolve(res)
        })
    })
}
module.exports = {request}