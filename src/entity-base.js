import Model from './model';
import { Hook, RequireObject } from './utils';

let modelName, route;

export default class EntityBase {

  constructor(ModelName, Route){
    modelName = ModelName;
    route = Route;
  }

  onInit(){
    let routes = [];
    if (!(route)){
      let files = Model.instance.routes[this.constructor.name];
      if (files){
        files.forEach((element) => {
          routes.push(RequireObject(element));  
        });
      };
    } else {
      routes.push(route);
    }
    routes.forEach((element) => {
      let model = Model.instance[modelName];  
      let methods = Object.keys(element);
      methods.forEach((method) => {
        let methodElement = this[method];
        if (methodElement){
          if (typeof methodElement === 'function'){
            model[method] = methodElement;
            model[method]['isEnable'] = element.isEnable;
            model.remoteMethod(method, element[method]);
            Hook(model, this, method);
          }
        }
      });
    });
  }

}
