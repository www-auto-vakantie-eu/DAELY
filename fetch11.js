fetch('https://thedutchthrowdown.nl/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
})
.then(res => res.text())
.then(html => {
  const matches = html.match(/<img[^>]+src="([^"]+)"/g);
  if (matches) {
    matches.forEach(m => console.log(m));
  }
}).catch(e => console.error(e));
