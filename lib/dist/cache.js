

const data = new Map();
function map(){
  return data
}

function set(key, value) {
  data.set(key, value);
}

function create(key, value){
  if(data.has(key)) return false
  data.set(key, value)
  return true
}

function get(key) {
  return data.get(key);
}

function has(key) {
  return data.has(key);
}

function remove(key) {
  data.delete(key);
}

function clear() {
  data.clear();
}

function size(){
    return data.size
}

function all(){
  return Array.from(data, ([key, value]) => ({ [key]: value }));
}

function obj(){
  // {..data}
  return Array.from(data, ([key, value]) => ({ [key]: value }));
}

function keys() {
    return Array.from(data.keys());
}

function values() {
  return Array.from(data.values());
}
function entries() {
  return Array.from(data.entries());
}

function forEach(callback) {
  data.forEach((value, key) => {
    callback(value, key);
  });
}

function isNull(key) {
  const value = data.get(key);
  return value === null || value === undefined;
}

function update(key, value) {
  if (data.has(key)) {
    data.set(key, value);
    return true;
  }
  return false;
}

function prefix(prefix) {
  return Array.from(data.keys()).filter(key => key.startsWith(prefix));
}

function suffix(prefix) {
    return Array.from(data.keys()).filter(key => key.endsWith(prefix));
}

function contains(prefix) {
    return Array.from(data.keys()).filter(key => key.includes(prefix));
}

function isEmpty() {
  return data.size === 0;
}


function type(key) {
  // Returns the type of the value associated with the key
  const value = data.get(key);
  if (value === null || value === undefined) {
    return 'null';
  }
  if (Array.isArray(value)) {
    return 'array';
  }
  return typeof value;
}


function deleteAll(keys) {
  // Deletes all the keys from the map
  keys.forEach(key => {
    data.delete(key);
  });
}


function expire(key, time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      data.delete(key);
      resolve();
    }, time);
  });
}

const object = {
  set: (key, value) => {
    data.set(key,JSON.stringify(value))
  },
  get: (key) => {
    return JSON.parse(data.get(key))
  }
}

module.exports = {
  set,
  create,
  get,
  has,
  remove,
  clear,
  size,
  all,
  keys,
  values,
  entries,
  forEach,
  update,
  prefix,
  suffix,
  contains,
  isNull,
  isEmpty,
  expire,
  type,
  deleteAll,
  object,
  map,
  obj,
  del: remove,
};
