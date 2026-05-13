fetch('https://thedutchthrowdown.nl/wp-content/uploads/2024/12/dutch-td-black-768x455.png', { method: 'HEAD' })
.then(res => console.log('dutch-td-black-768x455.png:', res.status, res.headers.get('content-type')));
