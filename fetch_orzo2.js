import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.fit.nl/recept/orzo-boerenkool');
  await page.waitForSelector('h1', { timeout: 10000 });
  
  const imgs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => img.src);
  });
  
  console.log('IMAGES:', imgs);
  
  await browser.close();
})();
