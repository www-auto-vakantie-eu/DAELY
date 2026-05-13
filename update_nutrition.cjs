const fs = require('fs');

const nutritionData = fs.readFileSync('data/nutritionData.ts', 'utf8');
const newRecipes = fs.readFileSync('new_recipes.txt', 'utf8');

const updatedData = nutritionData.replace(
  /  \{ id: 'nr30'[\s\S]*?\}[\r\n]+\];/,
  `  { id: 'nr30', name: 'Zoute karamel appeltaart (vegan)', category: 'Snack', calories: 382, protein: 4, carbs: 54, fats: 16, image: 'https://www.fit.nl/wp-content/uploads/2022/11/Vegan-appeltaart.jpg', prep_time: 105, ingredients: ['200 gram Suiker', '100 ml sojaroom', '220g ongezouten boter (plantaardige)', '1 tl. Zeezout', '400 gram Bloem', '75 gram Lichte bastaardsuiker', '1 tl. Bakpoeder', 'snuf Zout', 'snuf Kaneel', '750 gram appels (goudreinetten)'], instructions: ['Verwarm de oven voor op 180 graden en vet de springvorm in. Knip een bakpapiertje op maat en leg deze op de bodem van de springvorm.', 'Bereid de gezouten karamel. Vul een steelpannetje met 125 gram suiker en 50 ml water. Zet op laag vuur en laat in 10 – 15 minuten karameliseren. Verwarm ondertussen 100 ml sojaroom kort en snijd een blokje boter van 20 gram af. Als de suiker bruin is, zet het vuur uit en voeg de sojaroom toe. Roer goed door met een garde en voeg dan het blokje boter toe. Laat afkoelen en voeg dan 1 tl grof zeezout toe.', 'Schil de appels, snijd in kwarten en verwijder het klokhuis. Snijd de kwarten vervolgens in dunne plakjes. Meng de appels in het pannetje met de gezouten karamel.', 'Bereid het deeg voor door 400 gram bloem, 75 gram witte suiker, 75 gram lichte basterdsuiker, 1 tl bakpoeder, een snuf kaneel en een snuf zout goed door elkaar te mengen. Voeg dan 200 gram koude boter in blokjes toe en kneed met de hand of in de foodprocessor tot kruimelig deeg.', 'Gebruik 2/3 van het deeg en druk dit plat op de bodem en tegen de randen. Vul de taart dan met het appel-karamelmengsel en verdeel hierboven het overige kruimeldeeg. Plaats in de oven voor 50 tot 60 minuten.'] },\n${newRecipes}\n];`
);

fs.writeFileSync('data/nutritionData.ts', updatedData);
