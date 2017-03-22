import { ModelBinder } from './model-binder';
import { RequireObject, ReadGlob, GetModelSchema, GetDSConnector } from './utils';
import * as Rx from 'rx';

let modelLoader = {
  load: (app, configs) => {
    let modelSchemas = ReadGlob(`${configs.rootDir}/*-model.json`);
    if (modelSchemas) {
      if (modelSchemas.length > 1) {
        throw new Error(`Only one (1) model file, should be in ${configs.rootDir}`);
      }
      return Rx.Observable.from(modelSchemas)
        .flatMap((modelSchema) => {
          let schema = require(modelSchema), loader;
          if (schema.hasOwnProperty('mongodb')) {
            loader = mongoDbAttached(app, schema, configs);
          } else {
            loader = defaultAttached(app, schema, configs);
          }
          return loader;
        });
    }
  },
  extends: (app, dataSource, configs) => {
    let schema = GetModelSchema(configs.rootDir);
    if (schema) {
      let connector = GetDSConnector(configs.rootDir, dataSource);
      if (connector) {
        let _loader = RequireObject(`./model-loader-extends-${connector}`);
        let loader = new _loader(app, schema, dataSource, configs);
        loader.onInit();
      }
    }
  }
},
  mongoDbAttached = (app, schema, configs) => {
    let mongodbLoader = RequireObject('./model-loader-mongodb');
    let loader = new mongodbLoader(app, configs, schema);
    return loader.onInit();
  },
  defaultAttached = (app, schema, configs) => {
    return Rx.Observable.create((observer) => {
      let model = app.loopback.createModel(schema);
      model.on('attached', () => {
        /// ModelBinder.bindTo is synchronous so it waits the 
        /// process to finished before to compeleted
        ModelBinder.bindTo(configs, model);
        /// This is to make sure model is attached.
        observer.onNext(model.modelName);
        observer.onCompleted();
      });
      app.model(model, {
        dataSource: (configs.dataSource) ? configs.dataSource : 'db',
        public: true
      });
    });
  };

export { modelLoader }