import { ModelBinder } from './model-binder';
import { dataSourceLoader } from './datasource-loader';
import * as glob from 'glob';
import * as path from 'path';

let modelLoader = {
  load: (app, rootDir) => {  
    let configs = glob.sync(`${rootDir}/*-binder.config.js`);
    if (configs){
      configs.forEach((configSchema) => {
        let config = require(configSchema).configs;
        if (config){
          let modelName = config.model.toLowerCase();
          dataSourceLoader.load(app, rootDir);
          let modelSchemas = glob.sync(`${rootDir}/${modelName}.json`);
          if (modelSchemas){
            modelSchemas.forEach((modelSchema) => {
              let schema = require(modelSchema);
              let model = app.loopback.createModel(schema);
              model.on('attached', () => {
                ModelBinder.bindTo(config, model);
              });    
              app.model(model, { dataSource: config.dataSource, public: true } );    
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