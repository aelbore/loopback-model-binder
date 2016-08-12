/// <reference path="../typings/index.d.ts" />

import { ModelBinder } from './model-binder';
import { dataSourceLoader } from './datasource-loader';
import * as glob from 'glob';
import * as path from 'path';

let modelLoader = {
  load: (app, configs) => {  
    createModel(app, configs);
  }
},
createModel = (app, configs) => {
  let modelSchemas = glob.sync(`${configs.rootDir}/*-model.json`);
  if (modelSchemas){
    if (modelSchemas.length > 1){
      throw new Error(`Only one (1) model file, should be in ${rootDir}`);  
    }
    modelSchemas.forEach((modelSchema) => {
      let schema = require(modelSchema);
      let model = app.loopback.createModel(schema);
      model.on('attached', () => {
        ModelBinder.bindTo(configs, model);
      });    
      app.model(model, { 
        dataSource: (configs.dataSource) ? configs.dataSource : 'db', 
        public: true 
      });    
    });
  }
};

export { modelLoader }