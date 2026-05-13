import https from 'https';

const options = {
  hostname: 'archive.org',
  path: '/wayback/available?url=https://www.boodschappen.nl/recept/pasta-met-tonijn-en-mozzarella/',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data);
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
