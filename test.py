from cache import CacheDB
from perma import PermaDB

cache = CacheDB()
db = PermaDB("perma.db", {"memory": True, "preload": False})

db.set("test","tests")
print(db.get("test"))
print(db.has("test"))
print(db.typeof("test"))
print(db.delete("test"))

print(db.vacuum())
