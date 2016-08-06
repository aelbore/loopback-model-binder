import { Bind, Routes, isFunction, Hook, RequireObject  } from './entity-base-utils';

let modelName, route;

/**
 * Base Class for Model Entity
 * @class EntityBase
 */
export default class EntityBase {

  /**
   * Creates an instance of EntityBase.
   * @param {any} ModelName => name of the Model that you created
   * @param {any} Route => its optional, single route that you created
   */
  constructor(ModelName, Route){
    modelName = ModelName;
    route = Route;
  }

  /**
   * Initialize the Model. 
   * Attach the Entity and Routes/remoteMethod to Model. 
   * @return {void}
   */
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
