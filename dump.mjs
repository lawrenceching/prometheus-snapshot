import puppeteer from 'puppeteer';
import fs from 'fs';

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        headless: false,
        args: [`--window-size=1024,768`, '--start-maximized', '--start-fullscreen', ' --no-sandbox'],
        defaultViewport: {
            width: 1024,
            height: 768,
            deviceScaleFactor: 2
        }
    });
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto('C:\\Users\\lawre\\workspace\\metricdump\\dist\\inline.html');

    // Set screen size
    await page.setViewport({width: 1080, height: 1024});

    await sleep(5000)

    const html = await page.content();
    fs.writeFileSync('./saved.html', html);

    await browser.close();
})();