import Model from './model';
import { Hook } from './utils';

let modelName, route;

export default class ModelBase {

  constructor(ModelName, Route){
    modelName = ModelName;
    route = Route;
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
