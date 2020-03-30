const es = require('./libs/epidemicSound.js');

const tracks = async () => {
  return await es.tracksByGenre('Electronica Dance')
}

const t = tracks();

console.log(t);
