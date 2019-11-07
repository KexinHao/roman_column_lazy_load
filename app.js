const puppeteer = require('puppeteer');
const fs = require('fs');
const C = require ('./constants');
const USERNAME_SELECTOR = '#TPL_username_1';
const PASSWORD_SELECTOR = '#TPL_password_1';
const CTA_SELECTOR = '#J_SubmitStatic';

function wait (ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

async function run() {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1200 });
    await page.goto('https://item.taobao.com/item.htm?spm=a230r.1.14.169.171b15d6nk6qwE&id=569851181883&ns=1&abbucket=11#detail');

    await page.click (USERNAME_SELECTOR);
    await page.keyboard.type(C.username);
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(C.password);
    await page.click(CTA_SELECTOR);
    

    const imgSelector = 'img';
    let imageHref = await page.evaluate((sel) => {
        window.scrollBy(0, window.innerHeight);

        let arr = [];

        document.querySelectorAll(sel).forEach(function(elem) {
            let _string = elem.getAttribute('src').replace('/', '');
            let _stringarr = _string.split(".jpg_");

            if(_stringarr[0].search(".png") < 0) {
                if(_stringarr[0].search(".jpg") < 0) {
                    arr.push(_stringarr[0] + ".jpg");
                } else {
                    arr.push(_stringarr[0]);
                }
            }
        });

        // console.log(arr);
        // console.log(JSON.stringify( arr ));

        return arr;

    }, imgSelector);

    await wait(2500);

    fs.writeFile("pillars-output.js", "var images = " + JSON.stringify(imageHref, null, 2), function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });

    browser.close();
}

run();
