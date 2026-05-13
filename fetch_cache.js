import https from 'https';

const options = {
  hostname: 'webcache.googleusercontent.com',
  path: '/search?q=cache:https://www.boodschappen.nl/recept/pasta-met-tonijn-en-mozzarella/',
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
    console.log('Image:', imgMatch ? imgMatch[1] : 'No image');
    
    const titleMatch = data.match(/<title>(.*?)<\/title>/);
    console.log('Title:', titleMatch ? titleMatch[1] : 'No title');
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
