import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.grutto.com/nl/recepten/wrap-kalkoen');
  await page.waitForSelector('h1', { timeout: 10000 });
  
  const content = await page.evaluate(() => {
    return document.body.innerText;
  });
  
  const img = await page.evaluate(() => {
    const imgElement = document.querySelector('img');
    return imgElement ? imgElement.src : null;
  });
  
  console.log('IMAGE:', img);
  console.log('CONTENT:', content.substring(0, 1000));
  
  await browser.close();
})();
