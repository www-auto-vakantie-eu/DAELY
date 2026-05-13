import https from 'https';

https.get('https://www.wellnessyogachristine.com/blog/the-importance-of-having-a-set-morning-routine-for-daily-success', (res) => {
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
