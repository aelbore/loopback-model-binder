/// <reference path="../typings/index.d.ts" />

import { ModelBinder } from './model-binder';
import { dataSourceLoader } from './datasource-loader';
import * as glob from 'glob';
import * as path from 'path';

let modelLoader = {
  load: (app, rootDir, dataSource) => {  
    let configs = glob.sync(`${rootDir}/*-binder.config.js`);
    if (configs){
      if (configs.length > 1){
        throw new Error(`Only one (1) model binder.config file, should be in ${rootDir}`);  
      }
      configs.forEach((configSchema) => {
        let config = require(configSchema).configs;
        if (config){
          let modelSchemas = glob.sync(`${rootDir}/*-model.json`);
          if (modelSchemas){
            if (modelSchemas.length > 1){
              throw new Error(`Only one (1) model file, should be in ${rootDir}`);  
            }
            modelSchemas.forEach((modelSchema) => {
              let schema = require(modelSchema);
              let model = app.loopback.createModel(schema);
              model.on('attached', () => {
                ModelBinder.bindTo(config, model);
              });    
              app.model(model, { 
                dataSource: (dataSource) ? dataSource : 'db', 
                public: true 
              });    
            });
          }
        }  
      });
    } else {
      throw new Error(`configuration file for model not exist.`);
    }
  }
};

export { modelLoader }