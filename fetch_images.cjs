const https = require('https');

const urls = [
  "https://www.fit.nl/recept/carrotcake-ontbijt",
  "https://www.fit.nl/recept/chiapudding",
  "https://www.fit.nl/recept/snicker-overnight-oats",
  "https://www.fit.nl/recept/pompoen-overnight-oats",
  "https://www.fit.nl/recept/comfy-breakfast-bow",
  "https://www.fit.nl/recept/vegetarische-falafel-wrap",
  "https://www.fit.nl/recept/wrap-met-kip-mango-en-avocado",
  "https://www.fit.nl/recept/volkoren-wrap-bieten-feta",
  "https://www.fit.nl/recept/panini",
  "https://www.fit.nl/recept/buddha-bowl",
  "https://www.fit.nl/recept/zoete-aardappelsoep",
  "https://www.fit.nl/recept/lentesoep",
  "https://www.fit.nl/recept/rode-linzensoep",
  "https://www.fit.nl/recept/wrap-pizza",
  "https://www.fit.nl/recept/volkoren-zalmbroodje",
  "https://www.fit.nl/recept/pasta-champignon-spinazie",
  "https://www.fit.nl/recept/pasta-spinazie-kip",
  "https://www.fit.nl/recept/pasta-zalm-spinazie",
  "https://www.fit.nl/recept/pittige-thaise-curry",
  "https://www.fit.nl/recept/rode-curry-met-kikkererwten",
  "https://www.fit.nl/recept/ratatouille-met-kikkererwten",
  "https://www.fit.nl/recept/zalm-rijst",
  "https://www.fit.nl/recept/sushi-bowl-met-zalm",
  "https://www.fit.nl/recept/calzonewraps",
  "https://www.fit.nl/recept/viscurry-mango",
  "https://www.fit.nl/recept/appeltaart-snack",
  "https://www.fit.nl/recept/kikkererwten-snack",
  "https://www.fit.nl/recept/appelchips",
  "https://www.fit.nl/recept/protein-cookies",
  "https://www.fit.nl/recept/chocolade-mugcake",
  "https://www.fit.nl/recept/kikkererwten-cookiedough",
  "https://www.fit.nl/recept/fro-yo-snacks",
  "https://www.fit.nl/recept/fro-yo-met-fruit",
  "https://www.fit.nl/recept/havermoutkoekjes-appel",
  "https://www.fit.nl/recept/fruity-protein-balls",
  "https://www.fit.nl/recept/zelfgemaakte-eiwitshake",
  "https://www.fit.nl/recept/gezonde-fruitshake",
  "https://www.fit.nl/recept/choco-milkshake",
  "https://www.fit.nl/recept/havermoutsmoothie",
  "https://www.fit.nl/recept/knackebrod-eiersalade",
  "https://www.fit.nl/recept/matcha-protein-latte",
  "https://www.fit.nl/recept/banoffee",
  "https://www.fit.nl/recept/eiwitrijke-champignonsoep",
  "https://www.fit.nl/recept/broccolisoep",
  "https://www.fit.nl/recept/bloemkoolsoep-kerrie",
  "https://www.fit.nl/recept/courgettesoep",
  "https://www.fit.nl/recept/lichte-mosterdsoep",
  "https://www.fit.nl/recept/aardappelschotel-courgette-zalm",
  "https://www.fit.nl/recept/crispy-zalm",
  "https://www.fit.nl/recept/asian-bowl-met-zalm",
  "https://www.fit.nl/recept/rode-bieten-smoothie",
  "https://www.fit.nl/recept/spinazie-smoothie",
  "https://www.fit.nl/recept/detox-smoothie",
  "https://www.fit.nl/recept/ananasmango-smoothie",
  "https://www.fit.nl/recept/smoothie-vijgen",
  "https://www.fit.nl/recept/frisse-groene-smoothie",
  "https://www.fit.nl/recept/split-smoothie",
  "https://www.fit.nl/recept/super-smoothie",
  "https://www.fit.nl/recept/chocolade-smoothie",
  "https://www.fit.nl/recept/vegan-avocadoshake",
  "https://www.fit.nl/recept/kurkuma-latte",
  "https://www.fit.nl/recept/sinterklaas-latte",
  "https://www.fit.nl/recept/caramel-ice-coffee",
  "https://www.fit.nl/recept/whipped-ijskoffie"
];

const fetchImage = (url) => {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/<meta property="og:image" content="([^"]+)"/);
        if (match) {
          resolve({ url, image: match[1] });
        } else {
          resolve({ url, image: null });
        }
      });
    }).on('error', () => resolve({ url, image: null }));
  });
};

Promise.all(urls.map(fetchImage)).then(results => {
  console.log(JSON.stringify(results, null, 2));
});
