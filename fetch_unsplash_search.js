import https from 'https';

const options = {
  hostname: 'unsplash.com',
  path: '/s/photos/tibetan-singing-bowl',
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
    const ids = data.match(/photo-([a-zA-Z0-9-]+)/g);
    if (ids) {
      console.log(ids.slice(0, 10));
    } else {
      console.log('No ids found');
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
