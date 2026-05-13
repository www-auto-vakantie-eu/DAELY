fetch('https://lowlandsthrowdown.com/wp-content/uploads/2025/07/LOWLANDS_TD_basic-blue.png', {
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
}).then(res => {
  console.log(res.status);
  console.log(res.headers.get('content-type'));
  console.log(res.headers.get('content-length'));
});
