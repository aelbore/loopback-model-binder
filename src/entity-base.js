import { Bind, Routes, isFunction, Hook, RequireObject  } from './entity-base-utils';

let modelName, route;

export default class EntityBase {

  constructor(ModelName, Route){
    modelName = ModelName;
    route = Route;
  }

  onInit(){
    let routes = Routes(route, this.constructor.name);
    routes.forEach((routeElement) => {      
      if (Array.isArray(routeElement)){
        routeElement.forEach((element) => {
          Bind(modelName, element, this);
        });
      } else {
        Bind(modelName, routeElement, this);
      }
    });
  }

}
