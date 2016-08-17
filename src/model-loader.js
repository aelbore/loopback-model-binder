/// <reference path="../typings/index.d.ts" />

import { ModelBinder } from './model-binder';
import { RequireObject, ReadFileSync, ReadGlob, PathJoin } from './utils';
import * as async from 'async';

let modelLoader = {
  load: (app, configs) => {  
    let modelSchemas = ReadGlob(`${configs.rootDir}/*-model.json`);
    if (modelSchemas){
      if (modelSchemas.length > 1){
        throw new Error(`Only one (1) model file, should be in ${rootDir}`);  
      }
      modelSchemas.forEach((modelSchema) => {
        let schema = require(modelSchema);
        if (schema.hasOwnProperty('mongodb')){
          let mongodbLoader = RequireObject('./model-loader-mongodb');
          let loader = new mongodbLoader(app, configs, schema);
          loader.onInit();
        } else {
          let model = app.loopback.createModel(schema);
          model.on('attached', () => { ModelBinder.bindTo(configs, model); });   
          app.model(model, { 
            dataSource: (configs.dataSource) ? configs.dataSource : 'db', 
            public: true 
          });        
        } 
      });
    }
  }
};

export { modelLoader }