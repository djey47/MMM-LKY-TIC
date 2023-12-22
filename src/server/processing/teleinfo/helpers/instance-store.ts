import AppRootDir from 'app-root-dir';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import Path from 'path';
import { ModuleConfiguration } from '../../../../shared/domain/module-config';
import { Log } from '../../../utils/mm2_facades';
import { exportDataToOpensearch } from '../data-export/opensearch-exporter';
import { EntryValue, Store } from './store-models';
 
/**
 * Instance data store singleton
 */
export class InstanceStore {
  private static readonly PERSIST_PATH = Path.join(
    AppRootDir.get(),
    'config',
    'MMM-LKY-TIC.datastore.json'
  );
  private static readonly PERSIST_INTERVAL = 3600000;
  private static instance: InstanceStore;
  private static moduleConfig?: ModuleConfiguration;

  private store: Store;

  public static getInstance() {
    if (!InstanceStore.instance) {
      InstanceStore.instance = new InstanceStore();
    }
    return InstanceStore.instance;
  }

  public static setConfiguration(config: ModuleConfiguration) {
    InstanceStore.moduleConfig = config;
  }

  private constructor() {
    this.store = this.getFromPersist();

    this.persist();
    setInterval(this.persist.bind(this), InstanceStore.PERSIST_INTERVAL);

    this.export();
  }

  public reset() {
    this.store = this.getDefault();
    this.persist();
  }

  public put(key: string, value: EntryValue) {
    this.store.data[key] = value;
    this.store.meta.lastWriteTs = new Date().getTime();
  }

  public get(key: string) {
    if (InstanceStore.moduleConfig?.debug) {
      Log.log(
        `**** instance-store::get: ${JSON.stringify(
          { key, store: this.store },
          null,
          2
        )}`
      );
    }

    this.store.meta.lastReadTs = new Date().getTime();
    return this.store.data[key];
  }

  public async persist() {
    const contentsAsJSON = JSON.stringify(this.store, null, 2);
    await writeFile(InstanceStore.PERSIST_PATH, contentsAsJSON, 'utf-8');
    this.store.meta.lastPersistTs = new Date().getTime();

    if (InstanceStore.moduleConfig?.debug) {
      Log.log('**** instance-store::persist: done');
    }
  }  
  
  public persistSync() {
    const contentsAsJSON = JSON.stringify(this.store, null, 2);
    writeFileSync(InstanceStore.PERSIST_PATH, contentsAsJSON, 'utf-8');
    this.store.meta.lastPersistTs = new Date().getTime();

    if (InstanceStore.moduleConfig?.debug) {
      Log.log('**** instance-store::persistSync: done');
    }
  }

  /**
   * Export datastore to external location (for now only opensearch index is supported)
   */
  public async export() {
    const { moduleConfig } = InstanceStore;
    const dataExportConfig = moduleConfig?.teleinfo?.dataExport;
    if (!moduleConfig || !dataExportConfig) {
      return;
    }

    const { target, settings } = dataExportConfig;
    if (target !== 'opensearch' || !settings.opensearch) {
      return;
    }

    try { 
      await exportDataToOpensearch(this.store.data, moduleConfig);
    } catch (e) {
      Log.error(`!!!! MMM-LKY-TIC::instance-store::export ${JSON.stringify({ e })}`);
    }
  }

  private getFromPersist(): Store {
    if (!existsSync(InstanceStore.PERSIST_PATH)) {
      return this.getDefault();
    }

    try {
      const contentsAsJSON = readFileSync(InstanceStore.PERSIST_PATH, 'utf-8');
      return JSON.parse(contentsAsJSON);
    } catch (e: unknown) {
      Log.error(
        `!!!! MMM-LKY-TIC::instance-store::getFromPersist: ${JSON.stringify(e)}`
      );
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
