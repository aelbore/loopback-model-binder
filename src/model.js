import * as loopback from 'loopback';

let singleton = Symbol(),
  _model = Symbol();

export default class Model {
  
  constructor(){ 
  }
  
  static get instance(){
    if (!this[singleton]){
      this[singleton] = new Model();
    } 
    return this[singleton];
  }

  create(model){
    if (!(Model.instance.hasOwnProperty(model.modelName))){
      Model.instance[model.modelName] = model;
    }
  }  
}