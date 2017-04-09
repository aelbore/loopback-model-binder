import { ModelBinder } from './model-binder';
import { MongoDbUtils } from './model-loader-mongodb-utils';
import * as events from 'events';
import * as Rx from 'rx';

let app = Symbol();
let configs = Symbol();
let schema = Symbol();

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
   * Initialize/Load/Attached the Model to loopback 
   * return {Observable} => value = { configs: <object>, modelName: <string>, dataSource: <string> }
   */
  onInit(){
    let Schema = this[schema];
    let Configs = this[configs];
    let dataSource = Configs.dataSource;

    let schemaCopy = JSON.parse(JSON.stringify(Schema));
    let collections = schemaCopy.mongodb.collections;

    delete schemaCopy.mongodb;

    return Rx.Observable.create((observer) => {
      let model = this[app].loopback.createModel(schemaCopy);
      model.on('attached', () => { 
        ModelBinder.bindTo(Configs, model);
        MongoDbUtils.createCollection({
          app: this[app],
          modelName: model.modelName,
          dataSource: dataSource,
          collections: collections,
          schemaCopy: schemaCopy,
          configs: Configs
        }).subscribe((value) => {
          observer.onNext(value);
          observer.onCompleted();
        });  
      });   
      this[app].model(model, { 
        dataSource: (dataSource) ? dataSource : 'db', 
        public: true 
      }); 
    });
    
  }

}