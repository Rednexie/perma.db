const Sqlite3 = require("better-sqlite3");
const db = new Sqlite3('perma.db')
const path = require("path")
const fs = require("fs")
db.exec(`
  CREATE TABLE IF NOT EXISTS keyvalue (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`);

db.set = function(key, value){
  const insert = db.prepare('INSERT OR REPLACE INTO keyvalue (key, value) VALUES (?, ?)');
  insert.run(key, value)
}

db.get = function(key){
  const select = db.prepare('SELECT value FROM keyvalue WHERE key = ?');
  const result = select.get(key);
  return result ? result.value : null;
}

db.has = function(key){
  return !!db.get(key)
}

db.delete = function (key){
  const del = db.prepare('DELETE FROM keyvalue WHERE key = ?');
  del.run(key)
}

db.all = function() {
  const all = db.prepare('SELECT * FROM keyvalue');
  return all.all();
}

db.type = function(key) {
  const value = db.get(key);
  return typeof value;
}

db.deleteAll = function() {
  const deleteall = db.prepare('DELETE FROM keyvalue');
  deleteall.run();
}

db.deleteDB = function() {
  db.close()
  fs.unlinkSync(path.basename(db.name))
}

module.exports = db
