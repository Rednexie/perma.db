

declare type Any = any;



declare interface PermaDBOptions{
  minimize?: boolean,
  memory?: boolean,
  preload?: boolean,
  readonly?: boolean,
  wal?: boolean,
  size: number | null,
  onload: function | null
}

declare type string = string;

declare interface KeyValue{
  key: string,
  value: String | Buffer | Number | BigInt | null,
}

declare interface PermaDB{
  promises: object,
  db: object,
}

declare module "perma.db" {
  import { Database } from "better-sqlite3";
    export class PermaDB {
      constructor(filePath?: string = 'perma.db', options?: PermaDBOptions = { minimize: false, memory: false, preload: false, readonly: false, size: null, wal: false }): PermaDB;
      setSync(key: string, value: String | Buffer | Number | BigInt): String | Buffer | Number | BigInt
      getSync(key: string): String | Buffer | Number | BigInt;
      fetchSync(key: string): String | Buffer | Number | BigInt;
      updateSync(key: string, value: String | Buffer | Number | BigInt): Boolean;
      hasSync(key: string): Boolean;
      deleteSync(key: string): Boolean;
      removeSync(key: string): Boolean;
      typeSync(key: string): 'string' | 'number' | 'buffer' | 'object' | 'bigint' | null;
      allSync(): KeyValue[];
      fetchAllSync(): KeyValue[];
      deleteAllSync(): Boolean;
      removeAllSync(): Boolean;
      clearSync(): Boolean;
      dropSync(): Boolean;
      deleteDBSync(): Boolean;
      removeDBSync(): Boolean;
      unlinkDBSync(): Boolean;
      vacuumSync(): Boolean;
      backupSync(filePath: string): Boolean;
      querySync(sql: string, params: Any[]): Any;
      sizeSync(): Number;
      lengthSync(): Number;
      fileSizeSync(): Number;
      keysSync(): String[];
      valuesSync(): Any[];
      objectSync(): Object
      execSync(cmd: string): Any;
      closeSync(): Boolean;
      expireSync(key: string, time: number): Boolean; 
      startsWithSync(str: String): KeyValue[];
      endsWithSync(str: String): KeyValue[];
      containsSync(str: String): KeyValue[];
 

      set(key: string, value: String | Buffer | Number | BigInt): Promise<String | Buffer | Number | BigInt>
      get(key: string): Promise<String | Buffer | Number | BigInt>
      fetch(key: string): Promise<String | Buffer | Number | BigInt>
      update(key: string, value: String | Buffer | Number | BigInt): Promise<Boolean>
      has(key: string): Promise<Boolean>
      delete(key: string): Promise<Boolean>
      remove(key: string): Promise<Boolean>
      type(key: string): Promise<'string' | 'number' | 'buffer' | 'object' | 'bigint' | null>;
      all(): Promise<KeyValue[]>
      fetchAll(): Promise<KeyValue[]>
      deleteAll(): Promise<Boolean>
      clear(): Promise<Boolean>
      drop(): Promise<Boolean>
      deleteDB(): Promise<Boolean>
      removeDB(): Promise<Boolean>
      unlinkDB(): Promise<Boolean>
      vacuum(): Promise<Boolean>
      backup(path): Promise<Boolean>
      query(sql: string, ...params: Any[]): Promise<Any>
      size(): Promise<Number>
      length(): Promise<Number>
      fileSize(): Promise<Number>
      keys(): Promise<String[]>
      values(): Promise<Any[]>
      object(): Promise<Object>
      execSync(cmd: string): Promise<Any>;
      close(): Promise<Boolean>
      expire(key: string, time: number): Promise<Boolean>
      startsWith(str: string): Promise<KeyValue[]>
      endsWith(str: string): Promise<KeyValue[]>
      contains(str: string): Promise<KeyValue[]>

      db: Database;
    }
  
  }
