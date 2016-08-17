
let singleton = Symbol(),
  _model = Symbol();

/**
 * Model instance
 * @class Model
 */
export default class Model {
  
  constructor(){ 
  }
  
  /**
   * Object static instance for the Model
   * @static
   */
  static get instance(){
    if (!this[singleton]){
      this[singleton] = new Model();
    } 
    return this[singleton];
  }

  /**
   * Initialize or create Model 
   * @param {string} model => Model object
   */
  create(model){
    if (!(Model.instance.hasOwnProperty(model.modelName))){
      Model.instance[model.modelName] = model;
    }
  }  
}