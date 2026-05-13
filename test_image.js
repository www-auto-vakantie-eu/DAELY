import https from 'https';

const options = {
  hostname: 'www.boodschappen.nl',
  path: '/app/uploads/recipe_images/2by1_header/pasta-met-tonijn-en-mozzarella.jpg',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  }
};

https.get(options, (res) => {
  console.log('Status Code:', res.statusCode);
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
