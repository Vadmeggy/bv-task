const assert = require('chai').assert;

function randomStr(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function cookieAcceptButton(page) {
    const cookieAcceptBtn = await page.$(".iAgreeButton");
    await cookieAcceptBtn.click();
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function assertFromRedis(client, key, runtime) {
    const prev_run_time = await client.get(key);
    await client.set(key, runtime);
    if (prev_run_time != null) {
        assert(runtime < prev_run_time, `cur run: ${runtime} > prev run: ${prev_run_time}`)
    }
}


module.exports = {randomStr, cookieAcceptButton, sleep, assertFromRedis};