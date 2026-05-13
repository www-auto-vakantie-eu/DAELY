const fs = require('fs');
let appCode = fs.readFileSync('App.tsx', 'utf-8');
const lines = appCode.split('\n');
// We want to delete from line 1316 to 1624 (0-indexed: 1315 to 1623)
lines.splice(1315, 1624 - 1315 + 1);
fs.writeFileSync('App.tsx', lines.join('\n'));
console.log('Deleted lines');
