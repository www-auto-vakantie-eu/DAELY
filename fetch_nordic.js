import https from 'https';

const options = {
  hostname: 'nordicdutchman.nl',
  path: '/noorderlicht-uitgelegd/',
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
    const imgs = data.match(/<img[^>]+src="([^">]+)"/g);
    if (imgs) {
      imgs.forEach(img => {
        console.log(img);
      });
    } else {
      console.log('No images found');
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
