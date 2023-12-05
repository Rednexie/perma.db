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
<br>
<h2>new PermaDB(db_name, [options])</h2>
<h4>Returns database</h4>

By creating a new instance of the PermaDB class, you create and open a new sqlite3 database.<br>
You can customize the options of the database with arguments.
<hr>
---
--



<h4>db_name</h4>


_String_


The database name to be created. Default is `perma.db`.

<h4>options</h4>



_Object_



*memory* Boolean

`options.memory` specifies if the db works both with the database file and on memory. Default is `false`.

*minimize* Boolean 

`options.minimize` specifies if the db will automatically perform *vacuum*.


