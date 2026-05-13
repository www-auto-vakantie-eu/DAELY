const fs = require('fs');

const data = [
  {
    "url": "https://www.fit.nl/recept/carrotcake-ontbijt",
    "image": "https://www.fit.nl/wp-content/uploads/2016/07/Carrotcake-ontbijt.jpg",
    "name": "Carrot cake ontbijt",
    "category": "Ontbijt"
  },
  {
    "url": "https://www.fit.nl/recept/chiapudding",
    "image": "https://www.fit.nl/wp-content/uploads/2021/03/Chia-pudding-recept.jpg",
    "name": "Overnight chiapudding",
    "category": "Ontbijt"
  },
  {
    "url": "https://www.fit.nl/recept/snicker-overnight-oats",
    "image": "https://www.fit.nl/wp-content/uploads/2019/07/overnight-oats-fb.jpg",
    "name": "Snicker oats (overnight oats)",
    "category": "Ontbijt"
  },
  {
    "url": "https://www.fit.nl/recept/pompoen-overnight-oats",
    "image": "https://www.fit.nl/wp-content/uploads/2021/11/Overnight-oats-recept.jpg",
    "name": "Pompoen overnight oats",
    "category": "Ontbijt"
  },
  {
    "url": "https://www.fit.nl/recept/comfy-breakfast-bow",
    "image": "https://www.fit.nl/wp-content/uploads/2019/09/recept-buddha-bowl.jpg",
    "name": "Comfy breakfast bowl",
    "category": "Ontbijt"
  },
  {
    "url": "https://www.fit.nl/recept/vegetarische-falafel-wrap",
    "image": "https://www.fit.nl/wp-content/uploads/2019/08/falafel-wrap.jpg",
    "name": "Vegetarische falafel wrap",
    "category": "Lunch"
  },
  {
    "url": "https://www.fit.nl/recept/wrap-met-kip-mango-en-avocado",
    "image": "https://www.fit.nl/wp-content/uploads/2019/08/wrap-kip-mango-advocado-recept.jpg",
    "name": "Zoet-hartige wrap met kip, mango en avocado",
    "category": "Lunch"
  },
  {
    "url": "https://www.fit.nl/recept/volkoren-wrap-bieten-feta",
    "image": "https://www.fit.nl/wp-content/uploads/2016/04/Bieten-wrap-recept.jpg",
    "name": "Volkoren wrap met bieten en feta",
    "category": "Lunch"
  },
  {
    "url": "https://www.fit.nl/recept/panini",
    "image": "https://www.fit.nl/wp-content/uploads/2020/04/Panini-recept.jpg",
    "name": "Italiaanse panini",
    "category": "Lunch"
  },
  {
    "url": "https://www.fit.nl/recept/buddha-bowl",
    "image": "https://www.fit.nl/wp-content/uploads/2019/09/recept-buddha-bowl.jpg",
    "name": "Buddha bowl met tofu en quinoa",
    "category": "Lunch"
  },
  {
    "url": "https://www.fit.nl/recept/zoete-aardappelsoep",
    "image": "https://www.fit.nl/wp-content/uploads/2021/01/Recept-zoete-aardappelsoep.jpg",
    "name": "Zoete aardappelsoep met spinazie",
    "category": "Lunch"
  },
  {
    "url": "https://www.fit.nl/recept/lentesoep",
    "image": "https://www.fit.nl/wp-content/uploads/2021/02/Groene-lentesoep.jpg",
    "name": "Plantaardige groene lentesoep",
    "category": "Lunch"
  },
  {
    "url": "https://www.fit.nl/recept/rode-linzensoep",
    "image": "https://www.fit.nl/wp-content/uploads/2018/02/rode-linzensoep.jpg",
    "name": "Rode linzensoep met zoete aardappel",
    "category": "Lunch"
  },
  {
    "url": "https://www.fit.nl/recept/wrap-pizza",
    "image": "https://www.fit.nl/wp-content/uploads/2018/06/snelle-wrap-pizzas.jpg",
    "name": "Tortillawrap pizza",
    "category": "Lunch"
  },
  {
    "url": "https://www.fit.nl/recept/volkoren-zalmbroodje",
    "image": "https://www.fit.nl/wp-content/uploads/2016/08/broodje-zalm.jpg",
    "name": "Volkoren zalmbroodje",
    "category": "Lunch"
  },
  {
    "url": "https://www.fit.nl/recept/pasta-champignon-spinazie",
    "image": "https://www.fit.nl/wp-content/uploads/2021/02/Pasta-Champignon-spinazie-recept.jpg",
    "name": "Romige pasta met champignon en spinazie",
    "category": "Diner"
  },
  {
    "url": "https://www.fit.nl/recept/pasta-spinazie-kip",
    "image": "https://www.fit.nl/wp-content/uploads/2017/06/Pasta-met-verse-spinazie-en-kip-recept.jpg",
    "name": "Pasta met verse spinazie en kip",
    "category": "Diner"
  },
  {
    "url": "https://www.fit.nl/recept/pasta-zalm-spinazie",
    "image": "https://www.fit.nl/wp-content/uploads/2016/05/Pasta-met-zalm-recept.jpg",
    "name": "Pasta met zalm en cherrytomaten",
    "category": "Diner"
  },
  {
    "url": "https://www.fit.nl/recept/pittige-thaise-curry",
    "image": "https://www.fit.nl/wp-content/uploads/2017/06/Pittige-Thaise-curry-recept.jpg",
    "name": "Pittige Thaise curry",
    "category": "Diner"
  },
  {
    "url": "https://www.fit.nl/recept/rode-curry-met-kikkererwten",
    "image": "https://www.fit.nl/wp-content/uploads/2017/08/kikkererwten-curry-recept.jpg",
    "name": "Rode curry met kikkererwten",
    "category": "Diner"
  },
  {
    "url": "https://www.fit.nl/recept/ratatouille-met-kikkererwten",
    "image": "https://www.fit.nl/wp-content/uploads/2017/01/ratatouille-recept.jpg",
    "name": "Ratatouille met kikkererwten",
    "category": "Diner"
  },
  {
    "url": "https://www.fit.nl/recept/zalm-rijst",
    "image": "https://www.fit.nl/wp-content/uploads/2019/09/recept-zalm-rijst.jpg",
    "name": "Zoete zalm met Arabische rijst",
    "category": "Diner"
  },
  {
    "url": "https://www.fit.nl/recept/sushi-bowl-met-zalm",
    "image": "https://www.fit.nl/wp-content/uploads/2023/05/Sushi-Bowl.jpg",
    "name": "Sushi bowl met zalm",
    "category": "Diner"
  },
  {
    "url": "https://www.fit.nl/recept/calzonewraps",
    "image": "https://www.fit.nl/wp-content/uploads/2016/11/Recepten-template-calzonewrap.jpg",
    "name": "Calzonewraps",
    "category": "Diner"
  },
  {
    "url": "https://www.fit.nl/recept/viscurry-mango",
    "image": "https://www.fit.nl/wp-content/uploads/2016/07/viscurry-mango.jpg",
    "name": "Pittige groene viscurry met mango",
    "category": "Diner"
  },
  {
    "url": "https://www.fit.nl/recept/appeltaart-snack",
    "image": "https://www.fit.nl/wp-content/uploads/2018/08/appeltaart.jpg",
    "name": "Appeltaartsnack",
    "category": "Snack"
  },
  {
    "url": "https://www.fit.nl/recept/kikkererwten-snack",
    "image": "https://www.fit.nl/wp-content/uploads/2019/01/kikkererwten-snack.jpg",
    "name": "Geroosterde kikkererwten snack",
    "category": "Snack"
  },
  {
    "url": "https://www.fit.nl/recept/appelchips",
    "image": "https://www.fit.nl/wp-content/uploads/2019/02/appelchips.jpg",
    "name": "Skinny appelchips",
    "category": "Snack"
  },
  {
    "url": "https://www.fit.nl/recept/protein-cookies",
    "image": "https://www.fit.nl/wp-content/uploads/2021/10/Protein-chocolate-chip-coockies-recept.jpg",
    "name": "Protein chocolate chip cookies",
    "category": "Snack"
  },
  {
    "url": "https://www.fit.nl/recept/chocolade-mugcake",
    "image": "https://www.fit.nl/wp-content/uploads/2021/01/Mugcake-recept.jpg",
    "name": "Chocolade protein mugcake",
    "category": "Snack"
  },
  {
    "url": "https://www.fit.nl/recept/kikkererwten-cookiedough",
    "image": "https://www.fit.nl/wp-content/uploads/2016/06/Kikkererwten-cookiedough.jpg",
    "name": "Kikkererwten cookiedough",
    "category": "Snack"
  },
  {
    "url": "https://www.fit.nl/recept/fro-yo-snacks",
    "image": "https://www.fit.nl/wp-content/uploads/2019/03/for-yo.jpg",
    "name": "Fro-yo muesli snacks",
    "category": "Snack"
  },
  {
    "url": "https://www.fit.nl/recept/fro-yo-met-fruit",
    "image": "https://www.fit.nl/wp-content/uploads/2016/08/Gezonde-Fro-yo-met-fruit.jpg",
    "name": "Gezonde Fro-yo met fruit",
    "category": "Snack"
  },
  {
    "url": "https://www.fit.nl/recept/havermoutkoekjes-appel",
    "image": "https://www.fit.nl/wp-content/uploads/2021/03/Havermout-koekjes-recept.jpg",
    "name": "Zachte havermoutkoekjes met appel & cranberries",
    "category": "Snack"
  },
  {
    "url": "https://www.fit.nl/recept/fruity-protein-balls",
    "image": "https://www.fit.nl/wp-content/uploads/2019/05/Aarbei-proteine-ballen-recept.jpg",
    "name": "Fruity protein balls",
    "category": "Snack"
  },
  {
    "url": "https://www.fit.nl/recept/zelfgemaakte-eiwitshake",
    "image": "https://www.fit.nl/wp-content/uploads/2016/07/eiwitshake-maken.jpg",
    "name": "Zelfgemaakte eiwitshake",
    "category": "Smoothies"
  },
  {
    "url": "https://www.fit.nl/recept/gezonde-fruitshake",
    "image": "https://www.fit.nl/wp-content/uploads/2017/10/recept-fruit-smoothie.jpg",
    "name": "Gezonde fruitshake",
    "category": "Smoothies"
  },
  {
    "url": "https://www.fit.nl/recept/choco-milkshake",
    "image": "https://www.fit.nl/wp-content/uploads/2020/03/Chocolade-milkshake-recept.jpg",
    "name": "Chocolade frambozenmilkshake",
    "category": "Smoothies"
  },
  {
    "url": "https://www.fit.nl/recept/havermoutsmoothie",
    "image": "https://www.fit.nl/wp-content/uploads/2017/10/ontbijt-kwark-recept.jpg",
    "name": "Eiwitrijke havermoutsmoothie",
    "category": "Smoothies"
  },
  {
    "url": "https://www.fit.nl/recept/knackebrod-eiersalade",
    "image": "https://www.fit.nl/wp-content/uploads/2018/10/eiersalade-knackebrod.jpg",
    "name": "Knäckebröd met eiersalade",
    "category": "Snack"
  },
  {
    "url": "https://www.fit.nl/recept/matcha-protein-latte",
    "image": "https://www.fit.nl/wp-content/uploads/2023/04/Matcha-latte.jpg",
    "name": "Matcha protein latte",
    "category": "Smoothies"
  },
  {
    "url": "https://www.fit.nl/recept/banoffee",
    "image": "https://www.fit.nl/wp-content/uploads/2019/02/banoffee-1.jpg",
    "name": "Banoffee proteïnekoffie",
    "category": "Smoothies"
  },
  {
    "url": "https://www.fit.nl/recept/eiwitrijke-champignonsoep",
    "image": "https://www.fit.nl/wp-content/uploads/2020/12/champignonsoep-eiwitrijk-scaled.jpg",
    "name": "Eiwitrijke champignonsoep",
    "category": "Lunch"
  },
  {
    "url": "https://www.fit.nl/recept/broccolisoep",
    "image": "https://www.fit.nl/wp-content/uploads/2016/11/Recepten-templatebroccolisoepje.jpg",
    "name": "Broccolisoep",
    "category": "Lunch"
  },
  {
    "url": "https://www.fit.nl/recept/bloemkoolsoep-kerrie",
    "image": "https://www.fit.nl/wp-content/uploads/2019/01/bloemkoolsoep-facebook.jpg",
    "name": "Bloemkoolsoep met kerrie",
    "category": "Lunch"
  },
  {
    "url": "https://www.fit.nl/recept/courgettesoep",
    "image": "https://www.fit.nl/wp-content/uploads/2020/02/courgettesoep-recept.jpg",
    "name": "Courgettesoep",
    "category": "Lunch"
  },
  {
    "url": "https://www.fit.nl/recept/lichte-mosterdsoep",
    "image": "https://www.fit.nl/wp-content/uploads/2016/07/lichte-mostersoep.jpg",
    "name": "Lichte mosterdsoep met een scherp randje",
    "category": "Lunch"
  },
  {
    "url": "https://www.fit.nl/recept/aardappelschotel-courgette-zalm",
    "image": "https://www.fit.nl/wp-content/uploads/2017/01/aardappelschotel-courgette-zalm.jpg",
    "name": "Aardappelschotel met courgette en zalm",
    "category": "Diner"
  },
  {
    "url": "https://www.fit.nl/recept/crispy-zalm",
    "image": "https://www.fit.nl/wp-content/uploads/2022/03/Crispy-zalm-recept.jpg",
    "name": "Japanse zalm met crispy quinoa",
    "category": "Diner"
  },
  {
    "url": "https://www.fit.nl/recept/asian-bowl-met-zalm",
    "image": "https://www.fit.nl/wp-content/uploads/2019/01/DSC_6993.jpg",
    "name": "Asian bowl met zalm",
    "category": "Diner"
  },
  {
    "url": "https://www.fit.nl/recept/rode-bieten-smoothie",
    "image": "https://www.fit.nl/wp-content/uploads/2020/11/Recept-rode-biet-smoothie.jpg",
    "name": "Rodebietensmoothie met appel en kaneel",
    "category": "Smoothies"
  },
  {
    "url": "https://www.fit.nl/recept/spinazie-smoothie",
    "image": "https://www.fit.nl/wp-content/uploads/2021/03/Spinazie-smoothie-recept.jpg",
    "name": "Spinaziesmoothie met appel en banaan",
    "category": "Smoothies"
  },
  {
    "url": "https://www.fit.nl/recept/detox-smoothie",
    "image": "https://www.fit.nl/wp-content/uploads/2019/12/detox-smoothie-recept.jpg",
    "name": "Detox smoothie",
    "category": "Smoothies"
  },
  {
    "url": "https://www.fit.nl/recept/ananasmango-smoothie",
    "image": "https://www.fit.nl/wp-content/uploads/2020/05/kokos-mango-smoothie-recept.jpg",
    "name": "Ananas&mango smoothie",
    "category": "Smoothies"
  },
  {
    "url": "https://www.fit.nl/recept/smoothie-vijgen",
    "image": "https://www.fit.nl/wp-content/uploads/2021/10/Vijgen-smoothie-recept.jpg",
    "name": "Herfstsmoothie met vijgen",
    "category": "Smoothies"
  },
  {
    "url": "https://www.fit.nl/recept/frisse-groene-smoothie",
    "image": "https://www.fit.nl/wp-content/uploads/2020/06/Spinazie-kiwi-smoothie-recept.jpg",
    "name": "Frisse groene smoothie",
    "category": "Smoothies"
  },
  {
    "url": "https://www.fit.nl/recept/split-smoothie",
    "image": "https://www.fit.nl/wp-content/uploads/2016/03/split-smoothie-recept.jpg",
    "name": "Heerlijke split smoothie",
    "category": "Smoothies"
  },
  {
    "url": "https://www.fit.nl/recept/super-smoothie",
    "image": "https://www.fit.nl/wp-content/uploads/2016/06/Super-smoothie.jpg",
    "name": "Super smoothie",
    "category": "Smoothies"
  },
  {
    "url": "https://www.fit.nl/recept/chocolade-smoothie",
    "image": "https://www.fit.nl/wp-content/uploads/2018/10/choco-wake-up.jpg",
    "name": "Chocolade wake-up smoothie",
    "category": "Smoothies"
  },
  {
    "url": "https://www.fit.nl/recept/vegan-avocadoshake",
    "image": "https://www.fit.nl/wp-content/uploads/2018/06/vegan-chocoshake-facebook.jpg",
    "name": "Vegan avocado choco shake & hazelnootcrunch",
    "category": "Smoothies"
  },
  {
    "url": "https://www.fit.nl/recept/kurkuma-latte",
    "image": "https://www.fit.nl/wp-content/uploads/2021/01/kurkuma-latte-3.jpg",
    "name": "Kurkuma latte",
    "category": "Smoothies"
  },
  {
    "url": "https://www.fit.nl/recept/sinterklaas-latte",
    "image": "https://www.fit.nl/wp-content/uploads/2020/11/Recept-sinterklaas.jpg",
    "name": "Sinterklaas latte",
    "category": "Smoothies"
  },
  {
    "url": "https://www.fit.nl/recept/caramel-ice-coffee",
    "image": "https://www.fit.nl/wp-content/uploads/2018/07/Salted-Caramel-ice-coffee.jpg",
    "name": "Salted caramel ice coffee",
    "category": "Smoothies"
  },
  {
    "url": "https://www.fit.nl/recept/whipped-ijskoffie",
    "image": "https://www.fit.nl/wp-content/uploads/2022/05/Whipped-ijskoffie-recept.jpg",
    "name": "Whipped ijskoffie",
    "category": "Smoothies"
  }
];

const recipes = data.map((item, index) => {
  return `  {
    id: 'nr_new_${index}',
    name: '${item.name.replace(/'/g, "\\'")}',
    category: '${item.category}',
    calories: Math.floor(Math.random() * 300) + 200,
    protein: Math.floor(Math.random() * 30) + 10,
    carbs: Math.floor(Math.random() * 50) + 20,
    fats: Math.floor(Math.random() * 20) + 5,
    image: '${item.image || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=400'}',
    prep_time: Math.floor(Math.random() * 20) + 10,
    ingredients: ['Zie website voor ingrediënten'],
    instructions: ['Zie website voor de bereidingswijze'],
    url: '${item.url}'
  }`;
});

fs.writeFileSync('new_recipes.txt', recipes.join(',\n'));
