const fs = require('fs');

let appCode = fs.readFileSync('App.tsx', 'utf-8');

const extractFunction = (name) => {
  const startRegex = new RegExp(`const ${name} = \\(\\) => \\(`, 'g');
  const match = startRegex.exec(appCode);
  if (!match) return null;
  
  const startIndex = match.index;
  let openBraces = 0;
  let endIndex = -1;
  
  for (let i = startIndex; i < appCode.length; i++) {
    if (appCode[i] === '(') openBraces++;
    if (appCode[i] === ')') {
      openBraces--;
      if (openBraces === 0) {
        // Check if next character is semicolon
        if (appCode[i+1] === ';') {
          endIndex = i + 2;
        } else {
          endIndex = i + 1;
        }
        break;
      }
    }
  }
  
  if (endIndex !== -1) {
    const code = appCode.substring(startIndex, endIndex);
    appCode = appCode.substring(0, startIndex) + appCode.substring(endIndex);
    return code;
  }
  return null;
};

const renderForgotPassword = extractFunction('renderForgotPassword');
const renderCreateAccount = extractFunction('renderCreateAccount');
const renderLogin = extractFunction('renderLogin');

fs.writeFileSync('App.tsx', appCode);

const authScreensCode = `import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { ICONS } from '../ui/Icons';
import { Button } from '../ui/SharedUI';
import { THEMES } from '../../data/appData';

export const ForgotPasswordScreen: React.FC = () => {
  const { setIsForgotPassword } = useAppContext();
  
  return (
    ${renderForgotPassword.replace('const renderForgotPassword = () => (', '').replace(/;\\s*$/, '')}
  );
};

export const CreateAccountScreen: React.FC = () => {
  const { setIsCreatingAccount, setIsLoggedIn } = useAppContext();
  
  return (
    ${renderCreateAccount.replace('const renderCreateAccount = () => (', '').replace(/;\\s*$/, '')}
  );
};

export const LoginScreen: React.FC = () => {
  const { 
    activeThemeId, 
    setIsLoggedIn, 
    setIsCreatingAccount, 
    setIsForgotPassword 
  } = useAppContext();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    ${renderLogin.replace('const renderLogin = () => (', '').replace(/;\\s*$/, '')}
  );
};
`;

fs.writeFileSync('src/components/screens/AuthScreens.tsx', authScreensCode);
console.log('Extracted AuthScreens');
