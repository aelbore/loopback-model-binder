import Model from './model';
import { toSpinalCase } from './utils';
import * as events from 'events';

let app = Symbol();
let schema = Symbol();
let dataSource = Symbol();
let configs = Symbol();

export default class ModelLoaderExtendsRest {

  constructor(...Args) {
    /// http://stackoverflow.com/questions/9768444/possible-eventemitter-memory-leak-detected
    events.EventEmitter.prototype._maxListeners = 0;

    this[app] = Args[0];
    this[schema] = Args[1];
    this[dataSource] = Args[2];
  }

  onInit() {
    let datasource = this[app].dataSources[this[dataSource]];
    let dataAccessObject = datasource.connector.DataAccessObject;

    let newSchema = JSON.parse(JSON.stringify(this[schema]));

    let DAObjectKeys = Object.keys(dataAccessObject)
      .filter((key) => { return (key !== 'invoke'); });
    if (DAObjectKeys) {
      DAObjectKeys.forEach((daoKey) => {
        console.log(`Model ${newSchema.name} extends ${daoKey} from ${this[dataSource]}`);
        Model.instance[newSchema.name][daoKey] = dataAccessObject[daoKey];
      });
    }
  }

}