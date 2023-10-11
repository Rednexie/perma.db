const Sqlite3 = require("better-sqlite3");
const db = new Sqlite3('perma.db')
const path = require("path")
const fs = require("fs")
const { execSync, exec } = require("child_process")


db.exec(`
  CREATE TABLE IF NOT EXISTS perma (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`);

db.exec("VACUUM")

db.set = function(key, value){
  const insert = db.prepare('INSERT OR REPLACE INTO perma (key, value) VALUES (?, ?)');
  insert.run(key, value)
}

db.get = function(key){
  const select = db.prepare('SELECT value FROM perma WHERE key = ?');
  const result = select.get(key);
  return result ? result.value : null;
}

db.has = function(key){
  return !!db.get(key)
}

db.delete = function (key){
  const del = db.prepare('DELETE FROM perma WHERE key = ?');
  del.run(key)
}

db.all = function() {
  const all = db.prepare('SELECT * FROM perma');
  return all.all();
}

db.type = function(key) {
  const value = db.get(key);
  return typeof value;
}

db.deleteAll = function() {
  const deleteall = db.prepare('DELETE FROM perma');
  deleteall.run();
}

db.deleteDB = function() {
  db.close()
  fs.unlinkSync(path.basename(db.name))
}

db.vacuumCli = function(){

if(!process.env.sqlite3) console.error("sqlite3 is not installed.\nhttps = function//www.sqlite.org/");

if(process.platform == "win32"){
  if(fs.existsSync(execSync(`where sqlite3`, {encoding:"utf8"}))) console.log(execSync(`sqlite3 ${path.basename(db.name)} "VACUUM;"`, {encoding:"utf8"}))
}

else
  if(fs.existsSync(execSync(`which sqlite3`, {encoding:"utf8"}))) console.log(execSync(`sqlite3 ${path.basename(db.name)} "VACUUM;"`, {encoding:"utf8"}))
}



db.vacuum = function(){
  db.exec("VACUUM")
}

db.backup = function(path){ 
  db.exec(`VACUUM INTO '${path}'`);
}

module.exports = db
