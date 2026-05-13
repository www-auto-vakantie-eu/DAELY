import https from 'https';

const options = {
  hostname: 'html.duckduckgo.com',
  path: '/html/?q=tibetan+singing+bowl+image',
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
      console.log(urls.slice(0, 10));
    } else {
      console.log('No urls found');
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
