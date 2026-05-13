fetch('https://thedutchthrowdown.nl/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
})
.then(res => res.text())
.then(html => {
  const idx = html.indexOf('dutch-td-black-scaled.png');
  console.log(html.substring(Math.max(0, idx - 200), idx + 200));
}).catch(e => console.error(e));
