import * as playwright from 'playwright';

const albumId = 'B0pJtdOXmtn8z4I';

(async () => {
    const browser = await playwright.chromium.launch();

    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(`https://www.icloud.com/sharedalbum/sv-se/#${albumId}`);

        // const req = await page.waitForRequest((req) => {
        //     console.log(req.url());
        //     // return req.url().includes('sharedstreams/webstream');
        // });
        // console.log(req);

        for (let i = 0; i < 10; i++) {
            try {
                await (await page.$('.x-stream-footer-view')).scrollIntoViewIfNeeded();
            } catch {}
            await page.waitForTimeout(1000);
            await page.waitForLoadState('networkidle');
        }

        // const res = await req.response();
        // const body = await res.body();

        // const data = JSON.parse(body.toString());

        // console.log(data);

        await page.screenshot({ path: `test.png` });
    } finally {
        await browser.close();
    }
})();
