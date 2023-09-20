import json
import time
from threading import Timer

class CacheDB:

    def __init__(self):
        self.data = {}

    def set(self, key, value):
        self.data[key] = value

    def get(self, key):
        return self.data.get(key)

    def has(self, key):
        return key in self.data

    def remove(self, key):
        if key in self.data:
            del self.data[key]

    def clear(self):
        self.data.clear()

    def size(self):
        return len(self.data)

    def all(self):
        return [{key: value} for key, value in self.data.items()]

    def obj(self):
        return [{key: value} for key, value in self.data.items()]

    def keys(self):
        return list(self.data.keys())

    def values(self):
        return list(self.data.values())

    def entries(self):
        return list(self.data.items())

    def forEach(self, callback):
        for key, value in self.data.items():
            callback(value, key)

    def isNull(self, key):
        return self.data.get(key) is None

    def update(self, key, value):
        if key in self.data:
            self.data[key] = value
            return True
        return False

    def prefix(self, prefix):
        return [key for key in self.data.keys() if key.startswith(prefix)]

    def isEmpty(self):
        return len(self.data) == 0

    def type(self, key):
        value = self.get(key)
        if value is None:
            return 'null'
        elif isinstance(value, list):
            return 'array'
        else:
            return type(value).__name__

    def deleteAll(self, keys):
        for key in keys:
            self.remove(key)

    def expire(self, key, time_in_seconds):
        Timer(time_in_seconds, self.remove, args=(key,)).start()

    def subtract(self, key, number):
        value = self.data.get(key, 0) - number
        self.data[key] = value
        return value

    def push(self, key, element):
        arr = self.data.get(key, [])
        arr.append(element)
        self.data[key] = arr
        return arr

    def pop(self, key):
        arr = self.data.get(key, [])
        return arr.pop() if arr else None

    def fetch(self, key):
        return self.get(key)

    def fetchAll(self):
        return self.all()

    def startsWith(self, prefix):
        return [{key: value} for key, value in self.data.items() if key.startswith(prefix)]

    def endsWith(self, suffix):
        return [{key: value} for key, value in self.data.items() if key.endswith(suffix)]

    def suffix(self, suffix):
        return self.endsWith(suffix)

    def math(self, key, operation, number):
        operations = {
            '+': lambda x, y: x + y,
            '-': lambda x, y: x - y,
            '*': lambda x, y: x * y,
            '/': lambda x, y: x / y,
            '%': lambda x, y: x % y,
            '^': lambda x, y: x ** y
        }
        current_value = self.data.get(key, 0)
        new_value = operations[operation](current_value, number)
        self.data[key] = new_value
        return new_value

    def setProp(self, key, obj):
        current_obj = self.data.get(key, {})
        current_obj.update(obj)
        self.data[key] = current_obj
        return current_obj

    def getProp(self, key, prop):
        current_obj = self.data.get(key, {})
        return current_obj.get(prop)

    def object_set(self, key, value):
        self.data[key] = json.dumps(value)

    def object_get(self, key):
        return json.loads(self.data.get(key))

