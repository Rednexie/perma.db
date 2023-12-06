# PermaDB Docs
PermaDB is a versatile and easy to use database management library that aims to be fast, and save space.

# v1.0.9 API

# class PermaDB

Importing the class from the module.
```js
const { PermaDB } = require("perma.db")
````
<br>
<h2>new PermaDB(db_name, [options])</h2>
<h4>Returns database</h4>

By creating a new instance of the PermaDB class, you create and open a new sqlite3 database.<br>
You can customize the options of the database with arguments.



---



<h4>db_name</h4>


_String_


The database name to be created. Default is `perma.db`.

<h4>options</h4>



_Object_



*memory* Boolean

`options.memory` specifies if the db works both with the database file and on memory. Default is `false`.

*minimize* Boolean 

`options.minimize` specifies if the db will automatically perform *vacuum* operations. Default is `false`.

*preload* Boolean

`options.preload` specifies if all database should be loaded to the memory. Only works if the `options.memory` is `true`. Default is `false`.


# database

Creating the instance of the class imported from perma.db.


```js
const database = new PermaDB();
```





`new PermaDB(db_name, [options]): database`



## Synchronous Methods
- [database#setSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#setSync)
- [database#getSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#getSync)
- [database#fetchSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#fetchSync)
- [database#updateSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#updateSync)
- [database#hasSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#hasSync)
- [database#deleteSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#deleteSync)
- [database#removeSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#removeSync)
- [database#typeSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#typeSync)
- [database#allSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#allSync)
- [database#fetchAllSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#fetchAllSync)
- [database#deleteAllSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#deleteAllSync)
- [database#clearSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#clearSync)
- [database#removeAllSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#removeAllSync)
- [database#removeDBSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#removeDBSync)
- [database#vacuumSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#vacuumSync)
- [database#backupSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#backupSync)
- [database#querySync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#querySync)
- [database#sizeSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#sizeSync)
- [database#fileSizeSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#fileSizeSync)
- [database#keysSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#keysSync)
- [database#valuesSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#valuesSync)
- [database#objectSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#objectSync)
- [database#execSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#execSync)
- [database#closeSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#closeSync)
- [database#expireSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#expireSync)


### setSync(key, value)

Stores the value in the database, so you can access it with the key after.


*key* String



*value* Buffer || String || Date || Number || null





