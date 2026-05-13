import fs from 'fs';

const appCode = fs.readFileSync('App.tsx', 'utf-8');
const contextCode = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const appStates = [...appCode.matchAll(/const \[([a-zA-Z0-9_]+),\s*set[a-zA-Z0-9_]+\]\s*=\s*useState/g)].map(m => m[1]);
const contextStates = [...contextCode.matchAll(/const \[([a-zA-Z0-9_]+),\s*set[a-zA-Z0-9_]+\]\s*=\s*useState/g)].map(m => m[1]);

console.log('App states:', appStates.length);
console.log('Context states:', contextStates.length);

const missingInContext = appStates.filter(s => !contextStates.includes(s));
console.log('Missing in context:', missingInContext);
