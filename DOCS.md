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



<strong> Returns [database](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#database) </strong>




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
- [database#setSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#setsynckey-value)
- [database#getSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#getsynckey)
- [database#fetchSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#fetchSynckey)
- [database#updateSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#updateSynckey-value)
- [database#hasSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#hasSynckey)
- [database#deleteSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#deleteSynckey)
- [database#removeSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#removeSynckey)
- [database#typeSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#typesynckey)
- [database#allSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#allsync)
- [database#fetchAllSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#fetchallsync)
- [database#deleteAllSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#deleteallsync)
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

`setSync(key, value): value

Stores the value in the database, so you can access it with the key after.


*key* String



*value* Buffer || String || Date || Number || null


### getSync(key)

`getSync(key): value || null 



Returns the value with the given key in the database.



*key* String



### fetchSync(key)

`fetchSync(key): value || null`



Returns the value with the given key in the database.



*key* String


### updateSync(key, value)

`updateSync(key, value) : true || false`


If the given key exists in the database, changes its value and returns `true`.
If it doesn't exist, returns `false`. 


*key* String



*value* Buffer || String || Date || Number || null



### hasSync(key)


`hasSync(key) : true || false`

Checks if the given key exists in the database. 
If it does, returns `true`. Else returns `false`.


*key* String


### deleteSync(key)


`deleteSync(key): true || false`

Checks if the given key exists in the database. 
If it does, deletes it and returns `true`. Else returns `false`.


*key* String 


### removeSync(key)


`removeSync(key): true || false`

Checks if the given key exists in the database. 
If it does, deletes it and returns `true`. Else returns `false`.


*key* String 


### typeSync(key)

`typeSync(key): typeof value || null`

Checks if the given key exists in the database.
If it does, returns the type of the value. Else returns `null`.


*key* String


### allSync(key)

`allSync(): [{key, value}]`

Returns all key-value pairs in the database inside an array.


### fetchAllSync()

`fetchAllSync(): Array [{key, value}]`

Returns all key-value pairs in the database inside an array.

### deleteAllSync()

`deleteAllSync(): true`

Deletes all key-value pairs in the database, and returns true

### removeAllSync()


`removeAllSync(): true`


Deletes all key-value pairs in the database, and returns true


### clearSync()


`clearSync(): true`


Deletes all key-value pairs in the database, and returns true


### deleteDBSync()


`deleteDBSync(): true`


Unlinks(removes) the database after closing it and returns `true`.


### removeDBSync()


`removeDBSync(): true`


Unlinks(removes) the database after closing it and returns `true`.



### vacuumSync()

`vacuumSync(): true`


Vacuums the database and returns `true`.



### backupSync(path)

`backupSync(path): true || false`

Closes the database.
If the path already exists, returns false.
If it doesn't, creates a backup.


*path* String


### querySync(sql, ...params)


`querySync(sql, ...params): results`

Execute an sql query.


*sql* String

*params* Any


### sizeSync()


`sizeSync(): Number || null`

Returns the total size of the database contents.


### fileSizeSync()


`fileSizeSync(): Number`

Returns the database file size in bytes


### keysSync()

`keysSync(): Array [keys]`

Returns the array from the keys of the database.

### valuesSync()


`valuesSync(): Array [values(Buffer || String || Date || Number || null)]`


Returns the array of database values


### objectSync()


`objectSync(): {key, value} (Object)`

Returns the key-value pairs as a Javascript Object.

### execSync(cmd)

`execSync(cmd): output`

Executes the given sqlite command, and returns the output.

*cmd* String


### closeSync()


Closes the database.

### expireSync(key, time)

`execSync(key, time): true || false`

If exists, deletes the given key along with it's value from the database, and returns `true`.
Else returns `false`.



## Asynchronous Methods
- [database#set](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#setkey-value)
- [database#get](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#getkey)
- [database#fetch](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#fetchkey)
- [database#update](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#updatekey-value)
- [database#has](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#haskey)
- [database#delete](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#deletekey)
- [database#remove](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#removekey)
- [database#type](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#typekey)
- [database#all](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#all)
- [database#fetchAll](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#fetchall)
- [database#deleteAll](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#deleteall)
- [database#clear](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#clear)
- [database#removeAll](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#removeAll)
- [database#removeDB](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#removeDB)
- [database#vacuum](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#vacuum)
- [database#backup](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#backup)
- [database#query](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#query)
- [database#size](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#size)
- [database#fileSize](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#fileSize)
- [database#keysSync](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#keys)
- [database#values](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#values)
- [database#object](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#object)
- [database#exec](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#exec)
- [database#close](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#close)
- [database#expire](https://github.com/Rednexie/perma.db/blob/main/DOCS.md#expire)





### set(key, value)

`async set(key, value): Promise<Buffer || String || Date || Number || null>

Stores the value in the database, so you can access it with the key after.
Returns a promise which resolves with the value.

*key* String



*value* Buffer || String || Date || Number || null


### get(key)

`async get(key): Promise<value || null>



Returns a promise which resolves with the value for the given key in the database


*key* String



### fetch(key)

`async fetch(key): value || null`


Stores the value in the database, so you can access it with the key after.
Returns a promise which resolves with the value.


*key* String


### update(key, value)

`async update(key, value) : Promise<true || false>`


If the given key exists in the database, changes its value and resolves with `true`.
If it doesn't exist, resolves `false`. 


*key* String



*value* Buffer || String || Date || Number || null



### has(key)


`async has(key) : Promise<true || false>`

Checks if the given key exists in the database. 
If it does, resolves with `true`. Else resolves `false`.


*key* String


### deleteSync(key)


`deleteSync(key): true || false`

Checks if the given key exists in the database. 
If it does, deletes it and returns `true`. Else returns `false`.


*key* String 


### removeSync(key)


`removeSync(key): true || false`

Checks if the given key exists in the database. 
If it does, deletes it and returns `true`. Else returns `false`.


*key* String 


### typeSync(key)

`typeSync(key): typeof value || null`

Checks if the given key exists in the database.
If it does, returns the type of the value. Else returns `null`.


*key* String


### all(key)

`async all(): [{key, value}]`

Resolves all key-value pairs in the database inside an array.


### fetchAllSync()

`fetchAllSync(): Array [{key, value}]`

Returns all key-value pairs in the database inside an array.

### deleteAllSync()

`deleteAllSync(): true`

Deletes all key-value pairs in the database, and returns true

### removeAllSync()


`removeAllSync(): true`


Deletes all key-value pairs in the database, and returns true


### clearSync()


`clearSync(): true`


Deletes all key-value pairs in the database, and returns true


### deleteDBSync()


`deleteDBSync(): true`


Unlinks(removes) the database after closing it and returns `true`.


### removeDBSync()


`removeDBSync(): true`


Unlinks(removes) the database after closing it and returns `true`.



### vacuumSync()

`vacuumSync(): true`


Vacuums the database and returns `true`.



### backupSync(path)

`backupSync(path): true || false`

Closes the database.
If the path already exists, returns false.
If it doesn't, creates a backup.


*path* String


### querySync(sql, ...params)


`querySync(sql, ...params): results`

Execute an sql query.


*sql* String

*params* Any


### sizeSync()


`sizeSync(): Number || null`

Returns the total size of the database contents.


### fileSizeSync()


`fileSizeSync(): Number`

Returns the database file size in bytes


### keysSync()

`keysSync(): Array [keys]`

Returns the array from the keys of the database.

### valuesSync()


`valuesSync(): Array [values(Buffer || String || Date || Number || null)]`


Returns the array of database values


### objectSync()


`objectSync(): {key, value} (Object)`

Returns the key-value pairs as a Javascript Object.

### execSync(cmd)

`execSync(cmd): output`

Executes the given sqlite command, and returns the output.

*cmd* String


### closeSync()


Closes the database.

### expireSync(key, time)

`execSync(key, time): true || false`

If exists, deletes the given key along with it's value from the database, and returns `true`.
Else returns `false`.



