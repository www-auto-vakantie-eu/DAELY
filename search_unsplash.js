import https from 'https';

const options = {
  hostname: 'www.ah.nl',
  path: '/allerhande/recept/R-R1188320/poke-bowl-met-zalm',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const matches = data.match(/https:\/\/[^"']+\.(jpg|jpeg|png|webp)/gi);
    if (matches) {
      console.log([...new Set(matches)].filter(m => m.includes('allerhande') || m.includes('ah.nl')));
    }
  });
});
