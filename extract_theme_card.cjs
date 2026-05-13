const fs = require('fs');
const appCode = fs.readFileSync('App.tsx', 'utf-8');

const startIndex = appCode.indexOf('const ThemeCardVisual: React.FC');
const endIndex = appCode.indexOf('const App: React.FC = () => {');

const themeCardCode = appCode.substring(startIndex, endIndex);

const newAppCode = appCode.substring(0, startIndex) + appCode.substring(endIndex);
fs.writeFileSync('App.tsx', newAppCode);

const newComponentCode = `import React from 'react';
import { THEMES } from '../../data/appData';

${themeCardCode}
export default ThemeCardVisual;
`;

fs.writeFileSync('src/components/ui/ThemeCardVisual.tsx', newComponentCode);
console.log('Extracted ThemeCardVisual');
