fetch('https://thedutchthrowdown.nl/wp-content/uploads/2024/12/dutch-td-black.png', { method: 'HEAD' })
.then(res => console.log('dutch-td-black.png:', res.status, res.headers.get('content-type')));
