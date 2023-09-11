const Sqlite3 = require("better-sqlite3");

const path = require("path")
const fs = require("fs")
const util = require("util")
const { execSync, exec } = require("child_process")




function promisify(fn) { 
  
  return function(...args) { 
    return new Promise((resolve, reject) => { 
      try { const result = fn(...args); resolve(result); } 
      catch (error) { reject(error); } 
    }); 
  }; 
  
}



const { CacheDB } = require("./cache");

global.permadb = null


class PermaDB {
  
  constructor(dbn, options) {
    global.permadb = true
    this.dbn = this.dbn || "perma.db"

    this.db = new Sqlite3(dbn)
    this.initTable();
    this.options = options || {}
    if (this.options.minimize) {
        this.db.exec('VACUUM');
    }
    if(this.options.memory) this.initMemory();
  }



  initTable() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS perma (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);
   }

   initMemory(){
    this.cache = new CacheDB();

    
    if(this.options.preload != false)
    this.all()?.then(data => {
      data.forEach(item => {
        this.cache.set(item.key, item.value)
      });
    })
    
  }


  setSync(key, value){
    if(this.memory) this.cache.set(key, value)
    const insert = this.db.prepare('INSERT OR REPLACE INTO perma (key, value) VALUES (?, ?)');
    if(typeof value == "boolean") value = String(value)
    insert.run(key, value)
    return value;
  }
  
  getSync(key){
    if(this.memory && this.cache.has(key)) return this.cache.get(key)
    const select = this.db.prepare('SELECT value FROM perma WHERE key = ?');
    const result = select.get(key);
    return result ? result.value : null;
  }
  
  hasSync(key){
    if(this.memory && this.cache.has(key)) return true
    return !!this.db.get(key)
  }
  
  deleteSync(key){
    if(this.memory) this.cache.del(key)
    const del = this.db.prepare('DELETE FROM perma WHERE key = ?');
    del.run(key)
    return true;
  }
  
  typeSync(key) {
    if(this.memory && this.cache.has(key)) return this.cache.type(key)
    const value = this.db.get(key);
    return typeof value;
  }
    
  allSync() {
    if(this.memory && this.options.preload != false) return this.cache.all()
    const all = this.db.prepare('SELECT * FROM perma');
    return all.all();
  }

  deleteAllSync() {
    if(this.memory) this.cache.deleteAll()
    const deleteall = this.db.prepare('DELETE FROM perma');
    deleteall.run();
    return true;
  }

  clearSync(){
    if(this.memory) this.cache.clear()
    this.db.prepare(`DELETE FROM perma`).run();
  }
  
  deleteDBSync() {
    this.db.close()
    fs.unlinkSync(path.basename(this.db.name))
    return true;
  }

  vacuumSync(){
    this.db.exec("VACUUM")
    return true
  } 
  
  backupSync(filePath){ 
    this.db.exec(`VACUUM INTO '${filePath}'`);
    return filePath
  }
  
  querySync(sql, ...params) {
    const statement = this.db.prepare(sql);
    return statement.all(params);
  }



  // ASYNC
  // originally asynchronous functions
  // ASYNC

  

  set(key, value){
    return new Promise((resolve, reject) => {
      try{
        if(this.memory) this.cache.set(key, value);
        const insert = this.db.prepare('INSERT OR REPLACE INTO perma (key, value) VALUES (?, ?)');
        if(typeof value == "boolean") value = String(value)
        insert.run(key, value)
        resolve(value);
      }
      catch(error){
        reject(error)
      }
    })
  }


  get(key){
    return new Promise((resolve, reject) => {
      try{
      if(this.memory && this.cache.has(key)) return resolve(this.cache.get(key));
      const select = this.db.prepare('SELECT value FROM perma WHERE key = ?');
      const result = select.get(key);
      resolve(result);
      }
      catch(error){
        reject(error)
      }
    })
  }

 
  has(key){
    return new Promise((resolve, reject) => {
      try{
        if(this.memory && this.cache.has(key)) return resolve(true)
        else {
          const select = this.db.prepare('SELECT value FROM perma WHERE key = ?');
          const result = select.get(key);
          resolve(!!result.value)
        }
      }
      catch(error){
        reject(error)
      }
    })
  }



  delete(key){
    return new Promise((resolve, reject) => {
      try{
        if(this.memory) this.cache.del(key)
        const select = this.db.prepare('SELECT value FROM perma WHERE key = ?');
        const result = select.get(key);
        const del = this.db.prepare('DELETE FROM perma WHERE key = ?');
        if(result.value){
        del.run(result.value)
        resolve(true)
        }
        else{
          resolve(false)
        }
        
      }
      catch(error){
        reject(error)
      }
    })
  }

  type(key){
    return new Promise((resolve, reject) => {
      try{
        if(this.memory && this.cache.has(key)) return resolve(typeof this.cache.get(key));
        const select = this.db.prepare('SELECT value FROM perma WHERE key = ?');
        const result = select.get(key);
        resolve(typeof result.value)
      }
      catch(error){
        reject(error)
      }
    })
  }

  all(){
    return new Promise((resolve, reject) => {
      try{
      if(this.memory && this.options.preload != false) return resolve(this.cache.all() || [] );
      const all = this.db.prepare('SELECT * FROM perma');
      resolve( all.all() || [] );
      }
      catch(error){
        reject(error)
      }
    })
  }
  


  deleteAll(){
    return new Promise((resolve, reject) => {
      try{
        if(this.memory) this.cache.deleteAll()
        const deleteall = this.db.prepare('DELETE FROM perma');
        deleteall.run();
        resolve(true)
      }
      catch(error){
        reject(error)
      }
    })
  }


  deleteDB(){
    return new Promise((resolve, reject) => {
      try{
        this.db.close()
        fs.unlink(path.basename(this.db.name), (error) => {
          if(error) return resolve(false)
          else return resolve(true)
        })
      }
      catch(error){
        reject(error)
      }
    })
  }


  vacuum(){
    return new Promise((resolve, reject) => {
      try{
        this.db.exec("VACUUM")
        resolve(true)
      }
      catch(error){
        reject(error)
      }
    })
  }

  backup(filePath){
    return new Promise((resolve, reject) => {
      try{
        this.db.exec(`VACUUM INTO '${filePath}'`)
        resolve(filePath)
      }
      catch(error){
        reject(error)
      }
    })
  }

  query(sql, ...params){
    return new Promise((resolve, reject) => {
      try{
        const statement = this.db.prepare(sql);
        resolve(statement.all(params) || []);
      }
      catch(error){
        reject(error)
      }
    })
  }

  // PROMISIFIED 
  // Asynchronous functions, with promises.
  // PROMISIFIED
  

  // set, get, has, delete, type, all, deleteall, deletedb, backup, query

  setAsync(db, key, value){
    return new Promise((resolve, reject) => {
      try{
        if(this.memory) this.cache.set(key, value);
        const val = db.setSync(key, value); resolve(val) 
      }
      catch(error){
        reject(error)
      }
    })
  }

  getAsync(db, key){
    return new Promise((resolve, reject) => {
      try{ const value = db.getSync(key); resolve(value) }
      catch(error){reject(error)}
    })
  }

  hasAsync(db, key){
    return new Promise((resolve, reject) => {
      try{ const value = db.hasSync(key); resolve(value) }
      catch(error){reject(error)}
    })
  }


  deleteAsync(db, key){
    return new Promise((resolve, reject) => {
      try{ const value = db.deleteSync(key); resolve(value) }
      catch(error){reject(error)}
    })
  }

  typeAsync(db, key){
    return new Promise((resolve, reject) => {
      try{ const value = db.typeSync(key); resolve(value) }
      catch(error){reject(error)}
    })
  }


  allAsync(db){
    return new Promise((resolve, reject) => {
      try{ const value = db.allSync(); resolve(value) }
      catch(error){reject(error)}
    })
  }

  deleteAllAsync(db){
    return new Promise((resolve, reject) => {
      try{ const value = db.deleteAllSync(); resolve(value) }
      catch(error){reject(error)}
    })
  }


  deleteDBAsync(db){
    return new Promise((resolve, reject) => {
      try{ const value = db.deleteDBSync(); resolve(value) }
      catch(error){reject(error)}
    })
  }

  vacuumAsync(db){
    return new Promise((resolve, reject) => {
      try{ const value = db.vacuumSync(); resolve(value) }
      catch(error){reject(error)}
    })
  }

  backupAsync(db, filePath){
      return new Promise((resolve, reject) => {
        try{ const value = db.vacuumSync(filePath); resolve(value) }
        catch(error){reject(error)}
      })
  }

  queryAsync(db, sql, ...params){
    return new Promise((resolve, reject) => {
      try{ const value = db.querySync(sql, ...params); resolve(value) }
      catch(error){reject(error)}
    })
}



}





module.exports.PermaDB = PermaDB
