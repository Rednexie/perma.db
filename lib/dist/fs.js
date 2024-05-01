const fs = require("fs");

const exists = (path, callback) => {
    if(typeof path !== "string" || path instanceof Buffer || path instanceof URL) throw new Error('The "path" argument must be of type string or an instance of Buffer or URL. Received ' + typeof(path))
    if(typeof callback !== "function") throw new Error('The "cb" argument must be of type function. Received ' + typeof(callback))
    fs.access(path, (err, data) => err ? callback(err) : callback(data))
}

const promises_exists = async (path) => {
  return new Promise((resolve, reject) => {
    fs.access(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};


fs.exists = exists
fs.exists_ = exists
fs._exists = exists
fs.promises.exists = promises_exists



module.exports = fs
