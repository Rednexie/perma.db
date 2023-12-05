# PermaDB Docs
PermaDB is a versatile and easy to use database management library that aims to be fast, and save space.

# v1.0.9 API

### class PermaDB

Importing the class from the module.
```js
const { PermaDB } = require("perma.db")
````
<br>
Creating the instance of this class.
```js
const db = new PermaDB()
```
<br>

<h3>Returns database</h3>

By creating a new instance of the PermaDB class, you create and open a new sqlite3 database.
You can customize the options of the database with arguments.
