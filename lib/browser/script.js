class PermaDB {
    constructor(storeName = 'perma.db', dbName = "perma.db") {
        this.dbName = dbName;
        this.storeName = storeName;
        this.dbPromise = this.initDB();
    }

    

    async getObjectStore(mode = "readonly") {
        const db = await this.dbPromise;
        if (!db.objectStoreNames.contains(this.storeName)) {
            throw new Error(`Object store '${this.storeName}' not found in database '${this.dbName}'.`);
        }
        const transaction = db.transaction(this.storeName, mode);
        return transaction.objectStore(this.storeName);
    }

    async set(key, value) {
        const store = await this.getObjectStore("readwrite");
        return new Promise((resolve, reject) => {
            const request = store.put({value}, key);
            request.onsuccess = () => resolve(); // Resolve when the operation is successful
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async get(key) {
        const store = await this.getObjectStore();
        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = (event) => {
                const result = event.target.result;
                if (result) {
                    resolve(result.value); // Retrieve the value property of the stored object
                } else {
                    resolve(undefined); // Key not found
                }
            };
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async update(key, value) {
        const store = await this.getObjectStore("readwrite");
        return new Promise((resolve, reject) => {
            const getRequest = store.get(key);
            getRequest.onsuccess = (event) => {
                if (event.target.result !== undefined) {
                    const putRequest = store.put({ value }, key); // Update value as an object
                    putRequest.onsuccess = () => resolve(true);
                    putRequest.onerror = (event) => reject(event.target.error);
                } else {
                    resolve(false); // Key not found
                }
            };
            getRequest.onerror = (event) => reject(event.target.error);
        });
    }

    async has(key) {
        const store = await this.getObjectStore();
        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = (event) => resolve(event.target.result !== undefined);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async delete(key) {
        const store = await this.getObjectStore("readwrite");
        return new Promise((resolve, reject) => {
            const getRequest = store.get(key);
            getRequest.onsuccess = (event) => {
                if (event.target.result !== undefined) {
                    const deleteRequest = store.delete(key);
                    deleteRequest.onsuccess = () => resolve(true);
                    deleteRequest.onerror = (event) => reject(event.target.error);
                } else {
                    resolve(false); // Key not found
                }
            };
            getRequest.onerror = (event) => reject(event.target.error);
        });
    }

    async type(key) {
        const store = await this.getObjectStore();
        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = (event) => {
                const result = event.target.result;
                if (result) {
                    resolve(typeof result.value); // Retrieve the value property of the stored object
                } else {
                    resolve(undefined); // Key not found
                }
            };
            request.onerror = (event) => reject(event.target.error);
        });
    }
    async all() {
        const store = await this.getObjectStore();
        return new Promise((resolve, reject) => {
            const allEntries = [];
            const request = store.openCursor();
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    allEntries.push({ key: cursor.key, value: cursor.value.value });
                    cursor.continue();
                } else {
                    resolve(allEntries);
                }
            };
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async keys() {
        const store = await this.getObjectStore();
        return new Promise((resolve, reject) => {
            const keys = [];
            const request = store.openCursor();
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    keys.push(cursor.key);
                    cursor.continue();
                } else {
                    resolve(keys);
                }
            };
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async values() {
        const store = await this.getObjectStore();
        return new Promise((resolve, reject) => {
            const values = [];
            const request = store.openCursor();
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    values.push(cursor.value.value);
                    cursor.continue();
                } else {
                    resolve(values);
                }
            };
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async length() {
        const store = await this.getObjectStore();
        return new Promise((resolve, reject) => {
            const request = store.count();
            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async object() {
        const store = await this.getObjectStore();
        return new Promise((resolve, reject) => {
            const result = {};
            const request = store.openCursor();
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    result[cursor.key] = cursor.value.value;
                    cursor.continue();
                } else {
                    resolve(result);
                }
            };
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async deleteDatabase() {
        const _db = await this.dbPromise;
        _db.close();
        return new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase(this.dbName);
            request.onsuccess = () => resolve(true);
            request.onerror = (event) => reject(event.target.error);
            request.onblocked = () => {
                console.warn('Delete operation is blocked, close all connections to the database.');
                resolve(false);
            };
        });
    }

    async clear() {
        const store = await this.getObjectStore("readwrite");
        return new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => {
                resolve();
            };
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }


    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };

            request.onsuccess = (event) => {
                resolve(event.target.result);

                this.toJSON = this.object
                this.fetchAll = this.all
                this.fetch = this.get

                this.removeDB = this.deleteDatabase
                this.removeDatabase = this.deleteDatabase
                this.deleteDB = this.deleteDatabase

                this.deleteAll = this.clear
                this.remove = this.delete
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
}

