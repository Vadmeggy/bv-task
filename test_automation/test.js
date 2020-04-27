const assert = require('chai').assert;
const puppeteer = require('puppeteer');
const acceptCookie = require('./utils').cookieAcceptButton;
const sleep = require('./utils').sleep;
const randomString = require('./utils').randomStr;
const redis = require("async-redis");
const assertFromRedis = require('./utils').assertFromRedis

describe('Test Automation exercises', function () {
    let browser;
    let redisClient;
    const options = {'width': 1920, 'height': 1080};

    before(() => {
        redisClient = redis.createClient({host: process.env.REDIS_HOST || 'localhost'});
    });

    after(() => {
        redisClient.quit();
    });

    beforeEach(async () => {
        if (process.env.DOCKER_ENV) {
            browser = await puppeteer.launch({
                defaultViewport: null,
                executablePath: '/usr/bin/chromium-browser',
                args: [`--window-size=${options.width},${options.height}`, '--no-sandbox', '--headless', '--disable-gpu']
            });
        } else {
            browser = await puppeteer.launch({
                headless: process.env.BROWSER !== 'true',
                defaultViewport: null,
                args: [`--window-size=${options.width},${options.height}`,]
            });
        }
    });

    afterEach(async () => {
        await browser.close()
    });
    describe('test_1', function () {
        let test_run_time;

        it('Should render more than 12 pictures', async () => {
            const hrstart = process.hrtime();
            const page = await browser.newPage();
            await page.goto('http://www.smartclient.com/smartgwt/showcase/#featured_tile_filtering', {
                waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
            });
            await acceptCookie(page);
            await page.type('#isc_2Q', 'a');
            const slider = await page.$('#isc_2E');
            const sliderHandle = await slider.boundingBox();
            await page.mouse.move(sliderHandle.x, sliderHandle.y);
            await page.mouse.down();
            await page.mouse.move(sliderHandle.x - 67, sliderHandle.y, {steps: 10});
            await page.mouse.up();


            const sort_dropdown = await page.$('#isc_3E');
            await sort_dropdown.click();
            await page.waitForSelector('#isc_PickListMenu_0_row_1', {visible: true});
            const endangered = await page.$('#isc_PickListMenu_0_row_1');
            await endangered.click();


            const ascending = await page.$('#isc_3O');
            await ascending.click();

            // wait to render the new images in the tile
            await sleep(1000);
            const visible_cards2 = await page.$$('#isc_3W .simpleTile:not([aria-hidden="true"])');

            assert(visible_cards2.length > 12)
            await page.screenshot({path: 'snapshots/test1.png'});


            let hrt = process.hrtime(hrstart);
            test_run_time = hrt[0] + hrt[1] / 1000000000;
        });

        it('Should be faster than previus run', async () => {
            await assertFromRedis(redisClient, "test_1", test_run_time)
        });
    });
    describe('test_2', function () {
        let test_run_time;
        it('Select item with the given criteria', async () => {
            const hrstart = process.hrtime();
            const page = await browser.newPage();
            await page.goto('http://www.smartclient.com/smartgwt/showcase/#featured_dropdown_grid_category', {
                waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
            });
            await acceptCookie(page);

            await page.$('#isc_29').then(dropdown => dropdown.click());
            await page.waitForSelector('#isc_3P tr td div', {visible: true});
            const tableItem = await page.$('#isc_3P tr td div');

            const tableItemHandle = await tableItem.boundingBox();

            await page.mouse.move(tableItemHandle.x, tableItemHandle.y);
            while (true) {
                const elem = await page.$$('#isc_3Ptable tr[aria-selected="true"] td div');
                let list = [];
                for (const item of elem) {
                    let value = await page.evaluate(el => el.textContent, item);
                    list.push(value)
                }
                if (list[0].includes("Exercise") && list[1].includes("Ea") && Number(list[2]) >= 1.1) {
                    break
                }
                await page.keyboard.press('ArrowDown');
            }

            await page.screenshot({path: 'snapshots/test2.png'});
            await browser.close();
            let hrt = process.hrtime(hrstart);
            test_run_time = hrt[0] + hrt[1] / 1000000000;
        });
        it('Should be faster than previus run', async () => {
            await assertFromRedis(redisClient, "test_2", test_run_time)
        });
    });
    describe('test_3', function () {
        let test_run_time;
        it('Chane subitem descriptions', async () => {
            const hrstart = process.hrtime();
            const page = await browser.newPage();
            await page.goto('http://www.smartclient.com/smartgwt/showcase/#featured_nested_grid', {
                waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
            });
            await acceptCookie(page);

            await page.$('#isc_2Dtable tr').then(dropdown => dropdown.click());

            let description_counter = 0;
            while (true) {
                const elem = await page.$('#isc_2Dtable tr[aria-selected="true"] td:last-child div');
                let value = await page.evaluate(el => el.textContent, elem);
                if (value.includes('Correction')) {
                    // do work
                    await page.$('#isc_2Dtable tr[aria-selected="true"] td:first-child div').then(elem => elem.click());
                    await page.waitForSelector('.listTable > tbody > tr > td:nth-child(3)', {
                        visible: true,
                        timeout: 500
                    }).catch(e => {
                        // Table is empty, we should close it and check the next one
                    });
                    const description_list = await page.$$('.listTable > tbody > tr > td:nth-child(3)');
                    if (description_list.length > 0) {
                        for (const index in description_list) {
                            const desc_list = await page.$$('.listTable > tbody > tr > td:nth-child(3)');
                            const desc = desc_list[index]
                            await desc.click();
                            await sleep(50);
                            await page.keyboard.press('Backspace');
                            await sleep(50);
                            let desc_text = String(description_counter) + ' ' + randomString(10);
                            description_counter += 1;
                            await page.keyboard.type(desc_text);
                            await sleep(50);
                            await page.keyboard.press('Tab');
                            await sleep(50)
                        }
                        const buttons = await page.$$('td.button');
                        await buttons[0].click();
                        await page.screenshot({path: `snapshots/test3_${description_counter}.png`});
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
            await page.screenshot({path: 'snapshots/test3.png'});
            let hrt = process.hrtime(hrstart);
            test_run_time = hrt[0] + hrt[1] / 1000000000;
        });
        it('Should be faster than previus run', async () => {
            await assertFromRedis(redisClient, "test_3", test_run_time)
        });
    });
});