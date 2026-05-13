fetch('https://www.grutto.com/nl/recepten/wrap-kalkoen')
  .then(res => res.text())
  .then(text => {
    console.log(text.substring(0, 500));
  });
