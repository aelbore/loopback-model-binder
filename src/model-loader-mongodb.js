/// <reference path="../typings/index.d.ts" />

import Model from './model';
import { SeedData } from './model-loader-utils';
import { toSpinalCase } from './utils';
import { ModelBinder } from './model-binder';
import * as events from 'events';

let app = Symbol();
let configs = Symbol();
let schema = Symbol();
let attached = (app, dataSource, model, isPublic = false) => {
  app.model(model, { 
    dataSource: (dataSource) ? dataSource : 'db', 
    public: isPublic 
  }); 
};

/**
 * Model Loader for MongoDB DataSource
 */
export default class ModelLoaderMongodb {

  constructor(App, Configs, Schema){
    /// http://stackoverflow.com/questions/9768444/possible-eventemitter-memory-leak-detected
    events.EventEmitter.prototype._maxListeners = 0;
    
    this[app] = App;
    this[configs] = Configs;
    this[schema] = Schema;
  }

  /**
   * @param {any} schemaCopy
   * @param {any} collection
   * @returns
   */
  createNewSchema(schemaCopy, collection){
    let newCopy = JSON.parse(JSON.stringify(schemaCopy));       
    newCopy.name = collection;
    newCopy.http.path = toSpinalCase(collection);
    newCopy.mongodb = { collection: collection.toLowerCase() };
    return newCopy;
  }

  /**
   * Initialize/Load/Attached the Model to loopback 
   */
  onInit(){
    let Schema = this[schema];
    let Configs = this[configs];
    let dataSource = Configs.dataSource;

    let schemaCopy = JSON.parse(JSON.stringify(Schema));
    let collections = schemaCopy.mongodb.collections;

    delete schemaCopy.mongodb;

    let model = this[app].loopback.createModel(schemaCopy);
    model.on('attached', () => { ModelBinder.bindTo(Configs, model); });   
    attached(this[app], dataSource, model, true);

    if (collections){
      collections.forEach((collection) => {
        let newCopy = this.createNewSchema(schemaCopy, collection);
        let newModel = this[app].loopback.createModel(newCopy);
        newModel.on('attached', () => {
          SeedData(Configs.seed, newModel, dataSource);
          Model.instance[model.modelName][newModel.modelName] = newModel;
        });  
        attached(this[app], dataSource, newModel, false);
      }); 
    }
  }

}