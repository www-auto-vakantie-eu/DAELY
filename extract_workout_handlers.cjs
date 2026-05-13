const fs = require('fs');

let appCode = fs.readFileSync('App.tsx', 'utf-8');

const startGen = appCode.indexOf('const handleGenerateSchedule = async () => {');
const endGen = appCode.indexOf('const handleAddWorkout = async () => {');
const endAdd = appCode.indexOf('const handleAddCustomFood = () => {');

// Wait, handleAddCustomFood was removed earlier!
// Let's find the end of handleAddWorkout.
// It ends right before `if (!isLoggedIn) {` or `useEffect` or something.
