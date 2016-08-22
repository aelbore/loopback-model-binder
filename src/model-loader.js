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
  },
  extends: (app, dataSource, configs) => {
    let schema = getSchema(configs.rootDir);
    if (schema){
      let connector = getDSConnector(configs.rootDir, dataSource);
      if (connector){
        let _loader = RequireObject(`./model-loader-extends-${connector}`);
        let loader = new _loader(app, schema, dataSource, configs);
        loader.onInit();
      }
    }
  }
},
getSchema = (rootDir) => {
  let schema;
  let modelSchemas = ReadGlob(`${rootDir}/*-model.json`);
  if (modelSchemas){
    if (modelSchemas.length > 1){
      throw new Error(`Only one (1) model file, should be in ${rootDir}`);  
    }
    schema = require(modelSchemas[0]);
  }   
  return schema;
},
getDSConnector = (rootDir, dsKey) => {
  let connector;
  let datasources = ReadGlob(`${rootDir}/*-datasources.json`);  
  if (datasources){
    if (datasources.length > 1){
      throw new Error(`Only one (1) datasources file, should be in ${dsDirPath}`);
    }
    let dataSources = require(datasources[0]);
    if (dataSources){
      let ds = dataSources[dsKey];
      connector = (ds) ? ds.connector : null;    
    }
  } 
  return connector;
};

export { modelLoader }