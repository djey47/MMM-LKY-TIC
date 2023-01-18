
interface Store {
  [key: string]: string | number | object | [];
}

/**
 * Instance data store singleton
 */
export class InstanceStore {
  private static instance: InstanceStore;

  private store: Store;

  public static getInstance() {
    if (!InstanceStore.instance) {
      InstanceStore.instance = new InstanceStore();
    }
    return InstanceStore.instance;
  }

  constructor() {
    this.store = {};
  }

  clearAll() {
    this.store = {};
  }

  put(key: string, value: string | number | object | []) {
    this.store[key] = value;
  }

  get(key: string) {
    return this.store[key];
  }
}
