let singleton = Symbol();

/**
 * DataSourceConfig instance
 * @class DataSourceConfig
 */
export default class DataSourceConfig {

  private _config: Object = {};

  constructor() {}

  /**
   * Object static instance for the DataSourceConfig
   * @static
   */
   static get instance() {
     if (!this[singleton]) {
       this[singleton] = new DataSourceConfig;
     }
     return this[singleton];
   }

   set config(obj: Object) {
     this._config = obj;
   }

   get config():Object {
    return this._config;
   }
}