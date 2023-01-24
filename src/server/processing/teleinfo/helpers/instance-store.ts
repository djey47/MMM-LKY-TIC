import AppRootDir from 'app-root-dir';
import { existsSync, readFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import Path from 'path';
import { Log } from '../../../utils/mm2_facades';

interface Store {
  meta: {
    initTs: number;
    lastReadTs?: number;
    lastWriteTs?: number;
    lastPersistTs?: number;
  }
  data: {
    [key: string]: string | number | object | [];
  };
}

/**
 * Instance data store singleton
 */
export class InstanceStore {
  private static readonly PERSIST_PATH = Path.join(AppRootDir.get(), 'config', 'MMM-LKY-TIC.datastore.json');
  private static readonly PERSIST_INTERVAL = 3600000;
  private static instance: InstanceStore;

  private store: Store;

  public static getInstance() {
    if (!InstanceStore.instance) {
      InstanceStore.instance = new InstanceStore();
    }
    return InstanceStore.instance;
  }

  private constructor() {
    this.store = this.getFromPersist();

    this.persist();
    setInterval(this.persist.bind(this), InstanceStore.PERSIST_INTERVAL);
  }

  public reset() {
    this.store = this.getDefault();
    this.persist();
  }

  public put(key: string, value: string | number | object | []) {
    this.store.data[key] = value;
    this.store.meta.lastWriteTs = new Date().getTime();
  }

  public get(key: string) {
    // console.log('**** instance-store::get', { key, store: JSON.stringify(this.store, null, 2)});

    this.store.meta.lastReadTs = new Date().getTime();
    return this.store.data[key];
  }

  public async persist() {
    const contentsAsJSON = JSON.stringify(this.store, null, 2);
    await writeFile(InstanceStore.PERSIST_PATH, contentsAsJSON, 'utf-8');
    this.store.meta.lastPersistTs = new Date().getTime();
    console.log('**** instance-store::persist');
  }

  private getFromPersist(): Store {
    if (!existsSync(InstanceStore.PERSIST_PATH)) {
      return this.getDefault();
    }

    try {
      const contentsAsJSON =  readFileSync(InstanceStore.PERSIST_PATH, 'utf-8');
      return JSON.parse(contentsAsJSON);  
    } catch(e: unknown) {
      Log.error(`!!!! MMM-LKY-TIC::instance-store::getFromPersist: ${JSON.stringify(e)}`);
      return this.getDefault();
    }
  }

  private getDefault(): Store {
    return {
      meta: {
        initTs: new Date().getTime(),
      },
      data: {},
    };
  }
}
