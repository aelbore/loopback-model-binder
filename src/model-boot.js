/// <reference path="../typings/index.d.ts" />

import { modelLoader } from './model-loader';
import { dataSourceLoader } from './datasource-loader';
import * as glob from 'glob';

let app = Symbol();
let rootDir = Symbol();

const IGNORE_FILES = [
    "./**/*.route.js",
    "./index.js",
    "./*-binder.config.js",
    "./*-boot.js",
    "./*-datasources.json",
    "./*-model.json"  
];

/**
 * Boots the Model/Datasource that you create
 * @class ModelBoot
 */
export default class ModelBoot {

  /**
   * Creates an instance of ModelBoot.
   * @param {any} App => strongloop application object
   * @param {any} RootDir => root directory of the model and dataSource
   */
  constructor(App, RootDir) {
    this[app] = App;
    this[rootDir] = RootDir;
  }

  /**
   * Initialize the datasource and model
   */
  onInit(){
    dataSourceLoader.load(this[app], this[rootDir], 
      (dataSource) => {
        let localConfigs = Object.assign({}, this.configs);
        localConfigs.dataSource = dataSource;
        localConfigs.rootDir = this[rootDir];

        modelLoader.load(this[app], localConfigs);
      });
  }

  /**
   * Get or create an configs;
   * its overridable
  */
  get configs(){
    let configValues = null;
    let _configs = glob.sync(`${this[rootDir]}/*-binder.config.js`);
    if (_configs && _configs.length > 0){
      if (_configs.length > 1){
        throw new Error(`Only one (1) model binder.config file, should be in ${this[rootDir]}`);  
      }    
      _configs.forEach((configSchema) => {
        configValues = require(configSchema).configs; 
      });
    } else {
      configValues = {
        files: [{ include: "./**/*.js", ignore: IGNORE_FILES }]
      };
    }
    return configValues;
  }
}