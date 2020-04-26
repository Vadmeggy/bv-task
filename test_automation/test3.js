const puppeteer = require('puppeteer');
const rnd_str = require('./utils').random_str;

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

    let description_counter = 0;
    while (true) {
        const elem = await page.$('#isc_2Dtable tr[aria-selected="true"] td:last-child div');
        let value = await page.evaluate(el => el.textContent, elem);
        if (value.includes('Correction')) {
            // do work
            // await sleep(200);
            await page.$('#isc_2Dtable tr[aria-selected="true"] td:first-child div').then(elem => elem.click());
            // await sleep(200);
            await page.waitForSelector('.listTable > tbody > tr > td:nth-child(3)', {
                visible: true,
                timeout: 500
            }).catch(e => {
                // Table is empty, we should close it and check the next one
                console.log('Table is empty');
            });
            const description_list = await page.$$('.listTable > tbody > tr > td:nth-child(3)');
            if (description_list.length > 0) {
                for (const index in description_list) {
                    const desc_list = await page.$$('.listTable > tbody > tr > td:nth-child(3)');
                    const desc = desc_list[index]
                    await desc.click();
                    await sleep(100)
                    await page.keyboard.press('Backspace');
                    await sleep(100)
                    let desc_text = String(description_counter) + ' ' + rnd_str(10);
                    description_counter += 1;
                    await page.keyboard.type(desc_text);
                    await sleep(100)
                    await page.keyboard.press('Tab');
                    await sleep(100)
                }
                const buttons = await page.$$('td.button');
                await buttons[0].click();
                await sleep(100);
                await buttons[2].click();
                await page.waitForSelector('td.button', {hidden: true});
                await page.$('#isc_2Dtable tr[aria-selected="true"] td:nth-child(2) div').then(elem => elem.click());
            } else {
                await page.$('#isc_2Dtable tr[aria-selected="true"] td:first-child span').then(elem => elem.click());
            }
        }
        await page.keyboard.press('ArrowDown');

        const next = await page.$('#isc_2Dtable tr[aria-selected="true"] td:last-child div');
        let next_value = await page.evaluate(el => el.textContent, next);
        if (value === next_value) {
            break
        }
    }
    await page.screenshot({path: 'test3.png'});
    await sleep(1000000000);
    await browser.close();
})();
