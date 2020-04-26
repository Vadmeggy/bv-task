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
    await page.goto('http://www.smartclient.com/smartgwt/showcase/#featured_tile_filtering', {
        waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
    });
    const cookieAcceptBtn = await page.$(".iAgreeButton");
    await console.log('The element cookieAcceptBtn was resolved to: ' + cookieAcceptBtn);
    await cookieAcceptBtn.click();

    //
    // await sleep(5000);
    // const visible_cards = await page.$$('#isc_3W .simpleTile:not([aria-hidden="true"])');
    // await console.log(visible_cards.length);


    await page.type('#isc_2Q', 'a');
    const slider = await page.$('#isc_2E');
    const sliderHandle = await slider.boundingBox();
    await page.mouse.move(sliderHandle.x, sliderHandle.y);
    await page.mouse.down();
    await page.mouse.move(sliderHandle.x - 66, sliderHandle.y, {steps: 10});
    await page.mouse.up();


    const sort_dropdown = await page.$('#isc_3E');
    await sort_dropdown.click();
    await page.waitForSelector('#isc_PickListMenu_0_row_1', {visible: true});
    const endangered = await page.$('#isc_PickListMenu_0_row_1');
    await endangered.click();


    const ascending = await page.$('#isc_3O');
    await ascending.click();

    await sleep(1000);
    const visible_cards2 = await page.$$('#isc_3W .simpleTile:not([aria-hidden="true"])');
    await console.log(visible_cards2.length);
    await page.screenshot({path: 'example.png'});

    await sleep(1000000000);
    await page.screenshot({path: 'test1.png'});

    await browser.close();
})();
