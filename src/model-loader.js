import { ModelBinder } from './model-binder';
import * as glob from 'glob';
import * as path from 'path';

let modelLoader = {
  load: (app, configs) => {  
    let directoryPath = configs.rootDir;
    let modelName = configs.model.toLowerCase();

    let datasources = glob.sync(`${directoryPath}/*datasources.json`);
    if (datasources){
      datasources.forEach((datasource) => {
        let dataSources = require(datasource);
        let sources = Object.keys(dataSources);
        sources.forEach((source) => {
          if (source){ app.dataSource(source, dataSources[source]); }
        });
      });
    }

    let modelSchemas = glob.sync(`${directoryPath}/${modelName}.json`);
    if (modelSchemas){
      modelSchemas.forEach((modelSchema) => {
        let schema = require(modelSchema);
        let model = app.loopback.createModel(schema);
        model.on('attached', () => {
          ModelBinder.bindTo(configs, model);
        });    
        app.model(model, { dataSource: configs.dataSource, public: true } );    
      });
    }

  }
};

export { modelLoader }