const Sqlite3 = require("better-sqlite3");

const path = require("path")
const fs = require("./fs")

function createNestedObject(str, value) {
  const parts = str.split('.');
  if (parts.length <= 2) return str;

  let obj = {};
  let current = obj;

  for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
          current[part] = value;
      } else {
          current[part] = {};
          current = current[part];
      }
  }

  return obj;
}

// Outputs:
// {
//   "object": {
//     "property": {
//       "values": "value"
//     }
//   }
// }


const cachedb = require('./cache')

global.permadb = null


class PermaDB {
  /**
 * New Instance of Permanent Database
 * @class
 * @param {string} dbn - Database name or path, default is 'perma.db'.
 * @param {object} options - Some configuration for the database.
 * @param {boolean} options.minimize - If vacuum will be performed.
 * @param {boolean} options.memory - If the database will be also stored in memory.
 * @param {boolean} options.preload - If all database will be loaded to memory.
 * @param {boolean} options.readonly - If the database will be only open for getting data.
 * @param {boolean} options.wal - Enable SQLite's Write-Ahead Logging
 * @param {boolean} options.size - If there will be a max size for the daatabase.
 * @param {function} options.onload - Execute when database is loaded
 */

  constructor(dbn = "perma.db", options = {}) {

    global.permadb = true;
    this.dbn = dbn || "perma.db"
    this.db = new Sqlite3((this.dbn))
    
    //console.log(path.join(__dirname, this.dbn))   
    // custom path 
    
    this.initTable();
    this.options = options || {}
    if (this.options.minimize) {
        this.db.exec('VACUUM');
    }
    if(this.options.wal){
      this.db.pragma('journal_mode = WAL')
    }
    if(this.options.memory) this.initMemory();
    if(this.options.readonly == true) this.readonly = true;
    if(typeof this.options.onload === "function") this.options.onload();




  }



  initTable() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS perma (
        key TEXT PRIMARY KEY,
        value BLOB
      )
    `);
   }

   initMemory(){
    this.cache = cachedb;


    if(this.options.preload && this.options.preload == false) return;
    if(this.options.preload && this.options.preload == null) return;

    if(!this.all()) return
    this.all().then(data => {
      data.forEach(item => {
        this.cache.set(item.key, item.value)
      });
    })

  };



  updateSync(key, value){
    if(this.readonly) return false;
    if(this.memory && this.cache.has(key)) {
      return this.cache.get(key)
    }
    const select = this.db.prepare('SELECT value FROM perma WHERE key = ?');
    const result = select.get(key);
    const val = result ? result.value : null;
    if(val == null || val == undefined) return false;
    else {
      if(this.memory) this.cache.set(key, value)
      const insert = this.db.prepare('INSERT OR REPLACE INTO perma (key, value) VALUES (?, ?)');
      if(typeof value == "boolean") value = String(value)
      insert.run(key, value)
      return true;
    }
  }

  setSync(key, value){
      if(this.readonly) return false;
      if(this.memory) this.cache.set(key, value)
      const insert = this.db.prepare('INSERT OR REPLACE INTO perma (key, value) VALUES (?, ?)');
      if(typeof value == "boolean") value = Number(value)
      insert.run(key, value)
      return value;
  }

  getSync(key){
    if(this.memory && this.cache.has(key)) return this.cache.get(key)
    const select = this.db.prepare('SELECT value FROM perma WHERE key = ?');
    const result = select.get(key);
    return result ? result.value : null;
  }

  fetchSync(key){
    if(this.memory && this.cache.has(key)) return this.cache.get(key)
    const select = this.db.prepare('SELECT value FROM perma WHERE key = ?');
    const result = select.get(key);
    return result ? result.value : null;
  }

  hasSync(key){
    if(this.memory && this.cache.has(key)) return true
    const select = this.db.prepare('SELECT value FROM perma WHERE key = ?');
    const result = select.get(key);
    if(typeof result == "undefined" || typeof result == "null") return false
    if(result && result.value) return !!result.value
    else return false

  }

  deleteSync(key){
    if(this.readonly) return false;
    if(this.memory) this.cache.del(key)
    const del = this.db.prepare('DELETE FROM perma WHERE key = ?');
    del.run(key)
    return true;
  }

  destroySync(key){
    if(this.readonly) return false;
    if(this.memory) this.cache.del(key)
    this.db.prepare('DELETE FROM perma WHERE key = ?').run(key);
    return true;
  }

  removeSync(key){
    if(this.readonly) return false;
    if(this.memory) this.cache.del(key)
    const del = this.db.prepare('DELETE FROM perma WHERE key = ?');
    del.run(key)
    return true;
  }

  typeSync(key) {
    if(this.memory && this.cache.has(key)) return this.cache.type(key)
    const select = this.db.prepare('SELECT value FROM perma WHERE key = ?');
    const result = select.get(key)
    if(typeof result == "undefined" || typeof result == "null") return null;
    if(result && result.value) return typeof result.value
    else return null
  }

  allSync() {
    if(this.memory && this.options.preload != false) return this.cache.all()
    const all = this.db.prepare('SELECT * FROM perma');
    return all.all() || [];
  }

  fetchAllSync() {
    if(this.memory && this.options.preload != false) return this.cache.all()
    const all = this.db.prepare('SELECT * FROM perma');
    return all.all();
  }

  deleteAllSync() {
    if(this.readonly) return false;
    if(this.memory) this.cache.deleteAll()
    const deleteall = this.db.prepare('DELETE FROM perma');
    deleteall.run();
    return true;
  }

  removeAllSync() {
    if(this.readonly) return false;
    if(this.memory) this.cache.deleteAll()
    const deleteall = this.db.prepare('DELETE FROM perma');
    deleteall.run();
    return true;
  }

  clearSync(){
    if(this.readonly) return false;
    if(this.memory) this.cache.clear()
    const clear = this.db.prepare(`DELETE FROM perma`)
    clear.run()
    return true;
  }

  dropSync(){
    this.db.exec('DROP TABLE perma');
    return true;
  }

  deleteDBSync() {
    this.db.close()
    fs.rmSync(path.basename(this.db.name))
    return true;
  }

  removeDBSync() {
    this.db.close()
    fs.rmSync(path.basename(this.db.name))
    return true;
  }

  unlinkDBSync(){
    this.db.close()
    fs.unlinkSync(path.basename(this.db.name))
    return true;
  }

  vacuumSync(){
    this.db.exec("VACUUM")
    return true;
  }

  backupSync(filePath){
    if(typeof path !== "string" || path instanceof Buffer || path instanceof URL) return console.error('The "filePath" argument should be a string, or an instance of Buffer or URL. Received ' + typeof(path));
    if(filePath.length < 1) return console.error('The "filePath" argument should be valid.')
    if(fs.existsSync(filePath)) return false;
    this.db.exec(`VACUUM INTO '${filePath}'`);
    return true;
  }

  querySync(sql, ...params) {
    if(this.readonly) return false;
    const statement = this.db.prepare(sql);
    return statement.all(params);
  }

  closeSync(){
    this.db.close()
    return true;
  }

  sizeSync(){
    if(this.memory == true && this.options.preload != false){
      const all = this.cache.all()
      if(typeof all !== "object" && !Array.isArray(all)) return null;
      else return JSON.stringify(all).length
    }
    const allQuery = this.db.prepare('SELECT * FROM perma');
    const all = allQuery.all()
    if(typeof all !== "object" && !Array.isArray(all)) return null;
    else return JSON.stringify(all).length
  }


  fileSizeSync(){
    if(fs.existsSync(this.dbn)) return fs.statSync(this.dbn).size
    else return null;
  }


  keysSync(){
    if(this.memory && this.options.preload != false) {
      const keys = []
      const all = this.cache.all();
      if(typeof all !== "object" && !Array.isArray(all)) return keys;
      all.forEach(item => keys.push(item.key))
      return (keys)
    }
    const keys = []
    const allQuery = this.db.prepare('SELECT * FROM perma');
    const all = allQuery.all()
    if(typeof all !== "object" && !Array.isArray(all)) return keys;
    all.forEach(item => keys.push(item.key))
    return keys
  }

  valuesSync(){
    if(this.memory && this.options.preload != false) {
      const values = []
      const all = this.cache.all();
      if(typeof all !== "object" && !Array.isArray(all)) return values;
      all.forEach(item => values.push(item.value))
      return values
    }
    const values = []
    const allQuery = this.db.prepare('SELECT * FROM perma');
    const all = allQuery.all()
    if(typeof all !== "object" && !Array.isArray(all)) return values;
    all.forEach(item => values.push(item.value))
    return values
  }


  objectSync(){
    const object = {}
    if(this.memory && this.options.preload != false) return this.cache.obj()
    const allQuery = this.db.prepare('SELECT * FROM perma');
    const all = allQuery.all()
    if(typeof all !== "object" && !Array.isArray(all)) return object
    all.forEach((item) => object[item.key] = item.value)
    return object
  }


  execSync(cmd){
    this.db.exec(cmd);
    return true;
  }

  expireSync(key, time){
    if(typeof time !== "number") return console.error("Time should be type number, recieved type " + typeof time);
    const select = this.db.prepare('SELECT value FROM perma WHERE key = ?');
      const result = select.get(key);
      if(!result || !result.value) return false
      else     
      setTimeout(() => {
        if(this.memory) this.cache.del(key)
          const del = this.db.prepare('DELETE FROM perma WHERE key = ?');
          del.run(key)
      }, time)
      return true;
  }




  lengthSync(){
    let alls;
    if(this.memory && this.options.preload != false) alls = this.cache.all()
    else alls = this.db.prepare('SELECT * FROM perma').all()
    return alls.length
  }


  startsWithSync(str){
    if(this.memory && this.options.preload != false) return this.cache.prefix(str);
    else return this.db.prepare('SELECT * FROM perma WHERE value LIKE ?').all(`${str}%`);
  }

  endsWithSync(str){
    if(this.memory && this.options.preload != false) return this.cache.suffix(str);
    else return this.db.prepare('SELECT * FROM perma WHERE value LIKE ?').all(`%${str}`);
  }

  containsSync(str){
    if(this.memory && this.options.preload != false) return this.cache.includes(str);
    else return this.db.prepare('SELECT * FROM perma WHERE value LIKE ?').all(`%${str}%`);
  }

  createSync(key, value){
    if(this.memory) return this.cache.create();
    else {
      const val = this.db.prepare('SELECT value FROM perma WHERE key = ?').get(key);
      if(val == null || !val){
        this.db.prepare('INSERT INTO perma (key, value) VALUES (?, ?)').run(key, value);
        return true;
      }
      else return false;
      

    }
  }





  // ASYNC
  // originally asynchronous functions
  // ASYNC

  set(key, value){
    return new Promise((resolve, reject) => {
      try{
        if(this.readonly) return false;
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
      if(typeof result == "undefined" || typeof result == "null") return resolve(null)
      if(result && result.value) resolve(result.value);
      else resolve(null)
      }
      catch(error){
        reject(error)
      }
    })
  }

  fetch(key){
    return new Promise((resolve, reject) => {
      try{
      if(this.memory && this.cache.has(key)) return resolve(this.cache.get(key));
      const select = this.db.prepare('SELECT value FROM perma WHERE key = ?');
      const result = select.get(key);
      if(typeof result == "undefined" || typeof result == "null") return resolve(null)
      if(result && result.value) resolve(result.value);
      else resolve(null)
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
          if(typeof result == "undefined" || typeof result == "null") return resolve(false)
          if(result && result.value) return resolve(!!result.value)
          resolve(false)
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
        if(result && result.value){
        del.run(result.value)
        resolve(true)
        }
        else resolve(false)

      }
      catch(error){
        reject(error)
      }
    })
  }

  remove(key){
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
        else resolve(false)

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
        if(result && result.value) return resolve(typeof result.value)
        else resolve(null)
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

  fetchAll(){
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
  
  removeAll(){
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
        fs.rm(path.basename(this.db.name), (error) => {
          if(error) return resolve(false)
          else return resolve(true)
        })
      }
      catch(error){
        reject(error)
      }
    })
  }

  removeDB(){
    return new Promise((resolve, reject) => {
      try{
        this.db.close()
        fs.rm(path.basename(this.db.name), (error) => {
          if(error) return resolve(false)
          else return resolve(true)
        })
      }
      catch(error){
        reject(error)
      }
    })
  }

  unlinkDB(){
    return new Promise((resolve, reject) => {
      try{
        this.db.close()
        fs.rm(path.basename(this.db.name), (error) => {
          if(error) return resolve(false)
          else return resolve(true)
        })
      }
      catch(error){
        reject(error)
      }
    })
  }

  drop(){
    return new Promise((resolve, reject) => {
      try{
      if(this.memory && this.options.preload != false) return resolve(this.cache.all() || [] );
      const all = this.db.prepare('DROP TABLE perma');
      resolve( all.all() || [] );
      }
      catch(error){
        reject(error)
      }
    })
  }

  clear(){
    return new Promise((resolve, reject) => {
      try{
        if(this.memory) this.cache.clear()
        const clear = this.db.prepare(`DELETE FROM perma`)
        clear.run()
        return true;
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
        reject(error);
      }
    })
  }

  backup(filePath){
    if(typeof path !== "string" || path instanceof Buffer || path instanceof URL) return console.error('The "filePath" argument should be a string, or an instance of Buffer or URL. Received ' + typeof(path));
    if(filePath.length < 1) return console.error('The "filePath" argument should be valid.')
    return new Promise((resolve, reject) => {
      try{
        fs.exists_(filePath, (err) => {
          if(err){
            this.db.exec(`VACUUM INTO '${filePath}'`)
            return resolve(true);
          } 
          else {
            resolve(false)
          }
        })
        
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

  close(){
    return new Promise((resolve, reject) => {
      try{
        this.db.close()
        resolve(true)
      }
      catch(error){
        reject(error)
      }
    })
  }


  size(){
    return new Promise((resolve, reject) => {
      try{
        if(this.memory == true && this.options.preload != false){
          const all = this.cache.all()
          if(typeof all !== "object" && !Array.isArray(all)) return resolve(null);
          else return resolve(JSON.stringify(all).length)
        }
        const allQuery = this.db.prepare('SELECT * FROM perma');
        const all = allQuery.all()
        if(typeof all !== "object" && !Array.isArray(all)) resolve(null);
        else return resolve(JSON.stringify(all).length)
      }
      catch(error){
        reject(error)
      }
    })
    
  }

  fileSize(){
    return new Promise((resolve, reject) => {
      try{
        fs.stat(this.dbn, (err, stats) => {
          if (err) {
            return resolve(null);
          } else {
            return resolve(stats.size);
          }
        });
      }
      catch(error){
        reject(error)
      }
    })
      

  }


  object(){
    return new Promise((resolve, reject) => {
      try{
        const object = {}
        if(this.memory && this.options.preload != false) return resolve(this.cache.obj())
        const allQuery = this.db.prepare('SELECT * FROM perma');
        const all = allQuery.all();
        if(typeof all !== "object" && !Array.isArray(all)) return resolve(object)
        all.forEach((item) => object[item.key] = item.value)
        return resolve(object)
      }
      catch(error){
        reject(error)
      }
    })
    
  }

  exec(cmd){
    return new Promise((resolve, reject) => {
      try{
        this.db.exec(cmd);
        resolve(true)
      }
      catch(error){
        reject(error)
      }
    }) 
  }

  expire(key, time){
    return new Promise((resolve, reject) => {
      
      if(typeof time !== "number") return reject("Time should be type number, recieved type " + typeof time);
      try{
        setTimeout(() => {
          if(this.memory) this.cache.del(key)
          const select = this.db.prepare('SELECT value FROM perma WHERE key = ?');
          const result = select.get(key);
          const del = this.db.prepare('DELETE FROM perma WHERE key = ?');
          if(result && result.value){
          del.run(key)
          return resolve(true)
          }
          else{
            return resolve(false)
          }
        }, time)
        
      }
      catch(error){
        reject(error)
      }
    })
  }


  length(){
    return new Promise((resolve, reject) => {
      try{
        let alls;
        if(this.memory && this.options.preload != false) alls = this.cache.all()
        else alls = this.db.prepare('SELECT * FROM perma').all()
        resolve(alls.length)
      }
      catch(error){
        reject(error)
      }
    })
  }

  create(key, value){
    return new Promise((resolve, reject) => {
      try{
        if(this.memory) return resolve(this.cache.create());
        else{
          const val = this.db.prepare('SELECT value FROM perma WHERE key = ?').get(key)
          if(val == null || !val){
            this.db.prepare('INSERT INTO perma (key, value) VALUES (?, ?)').run(key, value);
            return resolve(true);
          }
          else return resolve(false);
        }
    
      }
      catch(error){
        reject(error)
      }
    })
  }


  startsWith(str){
    return new Promise((resolve, reject) => {
      try{
        if(this.memory && this.options.preload != false) return resolve(this.cache.prefix(str));
        else return resolve(this.db.prepare('SELECT * FROM perma WHERE value LIKE ?').all(`${str}%`));
      }
      catch(error){
        reject(error)
      }
    })
  }

  endsWith(str){
    return new Promise((resolve, reject) => {
      try{
        if(this.memory && this.options.preload != false) return resolve(this.cache.prefix(str));
        else return resolve(this.db.prepare('SELECT * FROM perma WHERE value LIKE ?').all(`%${str}`));
      }
      catch(error){
        reject(error)
      }
    })
  }

  contains(str){
    return new Promise((resolve, reject) => {
      try{
        if(this.memory && this.options.preload != false) return resolve(this.cache.prefix(str));
        else return resolve(this.db.prepare('SELECT * FROM perma WHERE value LIKE ?').all(`%${str}%`));
      }
      catch(error){
        reject(error)
      }
    })
  }

  clear(db){
      return new Promise((resolve, reject) => {
        try{ const value = db.clear(); resolve(value) }
        catch(error){reject(error)}
      })
  }
  
    // ALIASES
    existsSync = this.hasSync;
    insertSync = this.setSync;
    findSync = this.getSync;
    suffixSync = this.endsWith;
    prefixSync = this.startsWith;
    includesSync = this.containsSync;
  
    suffix = this.endsWith;
    prefix = this.startsWith;
    includes = this.contains;
    exists = this.has;
    insert = this.set;
    find = this.get;

    toJSONSync = this.objectSync;
    toJSON = this.object;



    // ALIASES
  

}





module.exports.PermaDB = PermaDB


