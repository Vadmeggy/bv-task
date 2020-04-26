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
    await page.goto('http://www.smartclient.com/smartgwt/showcase/#featured_dropdown_grid_category', {
        waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
    });
    const cookieAcceptBtn = await page.$(".iAgreeButton");
    await console.log('The element cookieAcceptBtn was resolved to: ' + cookieAcceptBtn);
    await cookieAcceptBtn.click();

    await page.$('#isc_29').then(dropdown => dropdown.click());
    await page.waitForSelector('#isc_3P tr td div', {visible: true});
    const tableItem = await page.$('#isc_3P tr td div');

    const tableItemHandle = await tableItem.boundingBox();

    await page.mouse.move(tableItemHandle.x, tableItemHandle.y);
    while (true){
        const elem = await page.$$('#isc_3Ptable tr[aria-selected="true"] td div');
        let list = [];
        for (const item of elem) {
            let value = await page.evaluate(el => el.textContent, item);
            list.push(value)
        }
        if (list[0].includes("Exercise") && list[1].includes("Ea") && Number(list[2]) >= 1.1){
            break
        }
        await page.keyboard.press('ArrowDown');
    }

    await page.screenshot({path: 'test2.png'});
    await browser.close();
})();
