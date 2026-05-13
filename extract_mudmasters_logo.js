import https from 'https';

https.get('https://mudmasters.com/nl', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const matches = data.match(/<img[^>]+src="([^">]+)"/g);
    if (matches) {
      matches.forEach(m => console.log(m));
    }
  });
});
