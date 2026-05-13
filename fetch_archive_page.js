import http from 'http';

const options = {
  hostname: 'web.archive.org',
  path: '/web/20230401034320/https://www.boodschappen.nl/recept/pasta-met-tonijn-en-mozzarella/',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  }
};

http.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const imgMatch = data.match(/<meta property="og:image" content="([^"]+)"/);
    console.log('Image:', imgMatch ? imgMatch[1] : 'No image');
    
    const titleMatch = data.match(/<title>(.*?)<\/title>/);
    console.log('Title:', titleMatch ? titleMatch[1] : 'No title');
    
    const ingredientsMatch = data.match(/<ul class="ingredients-list[^>]*>([\s\S]*?)<\/ul>/);
    if (ingredientsMatch) {
       console.log('Ingredients HTML:', ingredientsMatch[1].substring(0, 500));
    } else {
       console.log('No ingredients list found with that class.');
       // try another regex
       const allLi = data.match(/<li[^>]*>([\s\S]*?)<\/li>/g);
       if (allLi) {
         console.log('First few LIs:', allLi.slice(0, 10).join('\n').replace(/<[^>]+>/g, '').replace(/\s+/g, ' '));
       }
    }
    
    const instructionsMatch = data.match(/<div class="recipe-steps[^>]*>([\s\S]*?)<\/div>/);
    if (instructionsMatch) {
       console.log('Instructions HTML:', instructionsMatch[1].substring(0, 500));
    } else {
       console.log('No instructions found with that class.');
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
