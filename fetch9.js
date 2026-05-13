fetch('https://thedutchthrowdown.nl/wp-content/uploads/2024/12/dutch-td-black-scaled.png', { method: 'HEAD' })
.then(res => console.log('dutch-td-black-scaled.png:', res.status, res.headers.get('content-type')));

fetch('https://thedutchthrowdown.nl/wp-content/uploads/2025/11/image.png', { method: 'HEAD' })
.then(res => console.log('image.png:', res.status, res.headers.get('content-type')));
