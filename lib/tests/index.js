const {PermaDB} = require('perma.db');
const db = new PermaDB('', {  });
db.setSync('sa', 'as')
console.log(db.getSync('sa'))
