const puppeteer = require('puppeteer');


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

options = {'width': 1920, 'height': 1080};

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [`--window-size=${options.width},${options.height}`]
    });
    const page = await browser.newPage();
    await page.goto('http://www.smartclient.com/smartgwt/showcase/#featured_nested_grid', {
        waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
    });
    const cookieAcceptBtn = await page.$(".iAgreeButton");
    await console.log('The element cookieAcceptBtn was resolved to: ' + cookieAcceptBtn);
    await cookieAcceptBtn.click();

    await page.$('#isc_2Dtable tr').then(dropdown => dropdown.click());

    while (true) {
        const elem = await page.$('#isc_2Dtable tr[aria-selected="true"] td:last-child div');
        let value = await page.evaluate(el => el.textContent, elem);
        if (value.includes('Super')) {
            // do work
            await page.$('#isc_2Dtable tr[aria-selected="true"] td:first-child div').then(elem => elem.click());
            await page.waitForSelector('.listTable > tbody > tr > td:nth-child(3)', {visible: true});
            const description = await page.$('.listTable > tbody > tr > td:nth-child(3)');
            await description.click();
            await sleep(500);
            await page.keyboard.press('Backspace');
            await page.keyboard.type('VEGITELET ELERKEZETT')
            break
        }
        console.log(value)
        await page.keyboard.press('ArrowDown');
    }
    await page.screenshot({path: 'test3.png'});
    await sleep(1000000000);
    await browser.close();
})();
