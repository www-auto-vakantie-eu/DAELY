import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.leukerecepten.nl/recepten/chili-con-carne/');
  await page.waitForSelector('h1', { timeout: 10000 });
  
  const imgs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => img.src);
  });
  
  console.log('IMAGES:', imgs.filter(src => src.includes('chili-con-carne')));
  
  await browser.close();
})();
