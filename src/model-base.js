import Model from './model';
import { Hook } from './utils';
import * as loopback from 'loopback';

let modelName, route;

export default class ModelBase {

  constructor(ModelName, Route){
    modelName = ModelName;
    route = Route;
    Model.instance.create(modelName);
  }

  onInit(){
    let model = Model.instance[modelName];  
    let methods = Object.keys(route);
    methods.forEach((method) => {
      let methodElement = this[method];
      if (methodElement){
        if (typeof methodElement === 'function'){
          model[method] = methodElement;
          model[method]['isEnable'] = route.isEnable;
          model.remoteMethod(method, route[method]);
          Hook(model, this, method);
        }
      }
    });
  }

}
