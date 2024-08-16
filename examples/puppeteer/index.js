import puppeteer from 'puppeteer';
// Or import puppeteer from 'puppeteer-core';

import { writeFileSync } from 'node:fs'
import {promisify} from 'node:util';
const wait = promisify(setTimeout);

// Launch the browser and open a new blank page
const browser = await puppeteer.launch();
const page = await browser.newPage();

// Navigate the page to a URL.
await page.goto('https://lawrenceching.github.io/metricdump/');

await wait(5000)

const html = await page.evaluate(`document.querySelector('html').outerHTML`)

writeFileSync(`download.html`, html)

await browser.close();