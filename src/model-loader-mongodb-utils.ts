import { randomId, toSpinalCase } from './utils';
import { SeedData } from './model-loader-utils';
import Model from './model';
import * as Rx from 'rx';

let MongoDbUtils = {
  createCollection: (options) => {
    let collections = options.collections;
    let model = options.model;
    return Rx.Observable.from(collections)
      .flatMap((collection: any) => {
        let newCopy = MongoDbUtils.createNewSchema(options.schemaCopy, collection);
        return Rx.Observable.create((observer) => {
          let newModel = options.app.loopback.createModel(newCopy);
          newModel.on('attached', () => {
            SeedData(options.configs.seed, newModel, collection, options.dataSource);
            Model.instance[options.modelName][collection] = newModel;
            if ((collections.indexOf(collection) + 1) === collections.length) {
              observer.onNext(options.modelName);
              observer.onCompleted();
            }
          });
          options.app.model(newModel, {
            dataSource: (options.dataSource) ? options.dataSource : 'db',
            public: false
          });
        });
      });
  },
  createNewSchema: (schemaCopy: any, collection: any) => {
    let modelName = `${collection}_${randomId()}`;
    let newCopy = JSON.parse(JSON.stringify(schemaCopy));
    newCopy.name = modelName;
    newCopy.plural = `${modelName}s`;
    newCopy.http.path = toSpinalCase(collection);
    newCopy.mongodb = { collection: collection.toLowerCase() };
    return newCopy;
  }
};


export { MongoDbUtils }