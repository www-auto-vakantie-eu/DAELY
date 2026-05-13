const { execSync } = require('child_process');
execSync('git checkout HEAD -- App.tsx');
console.log('Restored App.tsx');
