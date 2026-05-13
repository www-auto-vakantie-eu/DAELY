import fs from 'fs';

const appCode = fs.readFileSync('App.tsx', 'utf-8');
const contextCode = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

// Get all the state variables and their setters from AppContext.tsx
const stateMatches = [...contextCode.matchAll(/const \[([a-zA-Z0-9_]+),\s*(set[a-zA-Z0-9_]+)\]\s*=\s*useState/g)];

const variablesToDestructure = [];
for (const match of stateMatches) {
  variablesToDestructure.push(match[1]);
  variablesToDestructure.push(match[2]);
}

// Get refs that are in context
const contextRefs = [...contextCode.matchAll(/const ([a-zA-Z0-9_]+)\s*=\s*useRef/g)].map(m => m[1]);

for (const ref of contextRefs) {
  variablesToDestructure.push(ref);
}

// Add any other functions exported by AppContext
const otherExports = ['handleStartLongPress', 'handleEndLongPress'];
for (const exp of otherExports) {
  if (contextCode.includes(`const ${exp} =`)) {
    variablesToDestructure.push(exp);
  }
}

const destructureCode = `  const {\n    ${variablesToDestructure.join(',\n    ')}\n  } = useAppContext();\n`;

// Insert the destructure code at the beginning of the App component
let newAppCode = appCode;
newAppCode = newAppCode.replace(/const App: React\.FC = \(\) => \{\s*/, `const App: React.FC = () => {\n${destructureCode}`);

fs.writeFileSync('App.tsx', newAppCode);
console.log('Refactored App.tsx');
