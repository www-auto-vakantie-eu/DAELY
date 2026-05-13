import fs from 'fs';

const appCode = fs.readFileSync('App.tsx', 'utf-8');
const contextCode = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const appRefs = [...appCode.matchAll(/const ([a-zA-Z0-9_]+)\s*=\s*useRef/g)].map(m => m[1]);
const contextRefs = [...contextCode.matchAll(/const ([a-zA-Z0-9_]+)\s*=\s*useRef/g)].map(m => m[1]);

console.log('App refs:', appRefs.length);
console.log('Context refs:', contextRefs.length);

const missingInContext = appRefs.filter(s => !contextRefs.includes(s));
console.log('Missing in context:', missingInContext);
