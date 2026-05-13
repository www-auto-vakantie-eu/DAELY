import https from 'https';

const options = {
  hostname: 'html.duckduckgo.com',
  path: '/html/?q=boodschappen.nl+pasta+met+tonijn+en+mozzarella',
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
    const results = data.match(/<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/g);
    if (results) {
      results.forEach(r => console.log(r.replace(/<[^>]+>/g, '').trim()));
    } else {
      console.log(data.substring(0, 3000));
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
