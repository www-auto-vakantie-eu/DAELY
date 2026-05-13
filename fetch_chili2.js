import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.leukerecepten.nl/recepten/chili-con-carne/');
  await page.waitForSelector('h1', { timeout: 10000 });
  
  const content = await page.evaluate(() => {
    return document.body.innerText;
  });
  
  console.log('CONTENT:', content.substring(2000, 4000));
  
  await browser.close();
})();
