import https from 'https';

const options = {
  hostname: 'en.wikipedia.org',
  path: '/wiki/Standing_bell',
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
    const urls = data.match(/<img[^>]+src="([^">]+)"/g);
    if (urls) {
      urls.forEach(u => {
        if (u.includes('upload.wikimedia.org') && u.includes('thumb')) {
          console.log(u);
        }
      });
    } else {
      console.log('No urls found');
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
