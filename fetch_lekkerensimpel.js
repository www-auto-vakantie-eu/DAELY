import https from 'https';

const options = {
  hostname: 'www.lekkerensimpel.com',
  path: '/pastasalade-met-tonijn-en-tomaat/',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const imgMatch = data.match(/<meta property="og:image" content="([^"]+)"/);
    if (imgMatch) {
      console.log('IMAGE_URL=' + imgMatch[1]);
    } else {
      console.log('No og:image found');
      // Try to find any img with 'tonijn' in src
      const imgs = data.match(/<img[^>]+src="([^">]+)"/g);
      if (imgs) {
        imgs.forEach(img => {
          if (img.includes('tonijn')) console.log(img);
        });
      }
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
