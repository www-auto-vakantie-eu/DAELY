import https from 'https';

const options = {
  hostname: 'www.boodschappen.nl',
  path: '/recept/pasta-met-tonijn-en-mozzarella/',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    if (res.statusCode === 200) {
      const titleMatch = data.match(/<title>(.*?)<\/title>/);
      console.log('Title:', titleMatch ? titleMatch[1] : 'No title');
      
      const imgMatch = data.match(/<meta property="og:image" content="([^"]+)"/);
      console.log('Image:', imgMatch ? imgMatch[1] : 'No image');
      
      const ingredientsMatch = data.match(/<ul class="ingredients-list[^>]*>([\s\S]*?)<\/ul>/);
      if (ingredientsMatch) {
         console.log('Ingredients HTML:', ingredientsMatch[1].substring(0, 500));
      }
      
      const instructionsMatch = data.match(/<div class="recipe-steps[^>]*>([\s\S]*?)<\/div>/);
      if (instructionsMatch) {
         console.log('Instructions HTML:', instructionsMatch[1].substring(0, 500));
      }
    } else {
      console.log('Failed to fetch. Data preview:', data.substring(0, 200));
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
