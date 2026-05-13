fetch('https://nl.spartan.com/icons/logoNew.svg', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
})
.then(res => res.text())
.then(svg => {
  console.log("logoNew.svg fills:", svg.match(/fill="[^"]+"/g));
});

fetch('https://nl.spartan.com/icons/helmet-new.svg', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
})
.then(res => res.text())
.then(svg => {
  console.log("helmet-new.svg fills:", svg.match(/fill="[^"]+"/g));
});
