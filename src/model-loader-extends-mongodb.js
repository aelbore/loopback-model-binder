/// <reference path="../typings/index.d.ts" />

import Model from './model';
import { toSpinalCase } from './utils';
import * as events from 'events';

let app = Symbol();
let schema = Symbol();
let dataSource = Symbol();
let configs = Symbol();

export default class ModelLoaderExtendsMongodb {

  constructor(...Args) {
    /// http://stackoverflow.com/questions/9768444/possible-eventemitter-memory-leak-detected
    events.EventEmitter.prototype._maxListeners = 0;

    this[app] = Args[0];
    this[schema] = Args[1];
    this[dataSource] = Args[2];
    this[configs] = Args[3];
  }

  createNewSchema(schemaCopy, collection){
    if (this[app].models[collection]){
      throw new Error(`Model ${collection} is already exist.`);
    }
    let newCopy = JSON.parse(JSON.stringify(schemaCopy));       
    newCopy.name = collection;
    newCopy.plural = collection;
    newCopy.http.path = toSpinalCase(collection);
    newCopy.mongodb = { collection: collection.toLowerCase() };
    return newCopy;
  }  

  onInit(){
    let ds = this[dataSource];
    let newSchema = JSON.parse(JSON.stringify(this[schema]));
    if (schema.hasOwnProperty('mongodb')){
       delete newSchema.mongodb;
    }
    if (newSchema.hasOwnProperty('extends')){
      let extendKeys = Object.keys(newSchema.extends);
      if (extendKeys && extendKeys.length > 0){
        let collections = newSchema.extends[ds].collections;
        collections.forEach((collection) => {
          let newCopy = this.createNewSchema(newSchema, collection);
          let newModel = this[app].loopback.createModel(newCopy);
          newModel.on('attached', () => {
            console.log(`Model ${newSchema.name} extends ${newModel.modelName}.`);
            Model.instance[newSchema.name][newModel.modelName] = newModel;
          });  
          this[app].model(newModel, { dataSource: (ds) ? ds : 'db',  public: false }); 
        });
      }
    }
  }  

}