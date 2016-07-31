import Model from './model';
import { isFunction, RequireObject, Hook } from './utils';

let Bind = (modelName, element, entity) => {
  let model = Model.instance[modelName];
  let methods = Object.keys(element)
      .filter((o) => { return o !== 'isEnable' });
  methods.forEach((method) => {
    let methodElement = entity[method];
    if (methodElement){
      if (isFunction(methodElement)){
        model[method] = methodElement;
        model[method]['isEnable'] = element.isEnable;
        model.remoteMethod(method, element[method]);
        Hook(model, entity, method);
      }
    }
  });  
},
Routes = (route, entityName) => {
  let routes = [];
  if (!(route)){
    let files = Model.instance.routes[entityName];
    if (files){
      files.forEach((element) => {
        routes.push(RequireObject(element));  
      });
    };
  } else {
    routes.push(route);
  }
  return routes;
};

export { Bind, Routes }
export { Hook, RequireObject, isFunction } from './utils';