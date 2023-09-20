import sqlite3
import os
import subprocess
from cache import CacheDB

global permadb
permadb = None

class PermaDB:
    def __init__(self, dbn, options):
        global permadb
        permadb = True
        self.options = options or {}
        self.dbn = dbn or "perma.db"
        self.db = sqlite3.connect(dbn)
        self.initTable()

        
        self.readonly = False
        self.strict = False
        self.preload = False
        self.memory = False
        if self.options.get("minimize") == True:
            self.db.execute('VACUUM')

        if self.options.get("readonly") == True:
            self.readonly = True
        if self.options.get("strict") == True:
            self.strict = True
        if self.options.get("preload") == True:
            self.preload = True
        if self.options.get("memory") == True:
            self.memory = True
            
            self.initMemory()
            

    
    def initTable(self):
        self.db.execute('''
            CREATE TABLE IF NOT EXISTS perma (
                key TEXT PRIMARY KEY,
                value TEXT
            )
        ''')
    

    def initMemory(self):
        self.cache = CacheDB()
        if self.preload != False:
            data = self.all()
            for item in data:
                self.cache.set(item.key, item.value)

    def set(self, key, value):
            if self.memory != False:
                self.cache.set(key, value)
            if isinstance(value, bool):
                value = str(value)
            cursor = self.db.cursor()
            cursor.execute('INSERT OR REPLACE INTO perma (key, value) VALUES (?, ?)', (key, value))
            self.db.commit()
            cursor.close()
            return value
    
    def get(self, key):
        if self.memory and self.cache.has(key):
            return self.cache.get(key)
        cursor = self.db.cursor()
        cursor.execute('SELECT value FROM perma WHERE key = ?', (key,))
        result = cursor.fetchone()
        self.db.commit()
        cursor.close()
        return result[0] if result else None
    
    def has(self, key):
        if self.memory and self.cache.has(key):
            return True
        cursor = self.db.cursor()
        cursor.execute('SELECT value FROM perma WHERE key = ?', (key,))
        result = cursor.fetchone()
        self.db.commit()
        cursor.close()
        return bool(result and result[0])  # True if there's a value, otherwise False

    
    def delete(self, key):
        if self.memory:
            self.cache.remove(key)
        cursor = self.db.cursor()
        cursor.execute('DELETE FROM perma WHERE key = ?', (key,))
        self.db.commit()
        cursor.close()
        return True
    
    def typeof(self, key):
        if self.memory and self.cache.has(key):
            return self.cache.type(key)
        cursor = self.db.cursor()
        cursor.execute('SELECT value FROM perma WHERE key = ?', (key,))
        result = cursor.fetchone()
        self.db.commit()
        cursor.close()
        return type(result[0]).__name__ if result else None
    
    def all(self):
        if self.memory and self.preload != False:
            return self.cache.all()
        cursor = self.db.cursor()
        cursor.execute('SELECT * FROM perma')
        value = self.cursor.fetchall()
        cursor.close()
        return value
    def deleteAll():
        cursor = self.db.cursor()
        cursor.execute('DELETE FROM perma')
        self.db.commit()
        cursor.close()
        if self.memory == True:
            self.cache.clear()
        return True

    def clear(self):
        if self.memory == True:
            self.cache.clear()
        cursor = self.db.cursor()
        cursor.execute('DELETE FROM perma')
        self.db.commit()
        cursor.close()
        return True

    def deleteDB(self):
        self.db.close()
        os.unlink(path.basename(self.db.name))
        return True

    def vacuum(self):
        self.db.execute('VACUUM')
        return True

    def backup(self, filePath):
        self.db.execute(f"VACUUM INTO '{filePath}'")
        return filePath

    def query(self, Ssql, *params):
        cursor = self.db.cursor()
        cursor.execute(Ssql, params)
        value = cur.fetchall()
        self.db.commit()
        cursor.close()
        return value
        
