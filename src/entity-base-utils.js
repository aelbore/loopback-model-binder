import Model from './model';
import Entity from './entity-collections';
import { isFunction, RequireObject, Hook } from './utils';

/*
* Bind/Attach the Entity to Model.
* @param {string} modelName => name of the model
* @param {string} element => directory to search the *-datasources.json file. 
* @param {object} entity => name of the model
* @return {void} 
*/
let Bind = (modelName, element, entity) => {
  let entityObject = Entity.collection.byEntity(entity.constructor.name);
  modelName = (modelName) ? modelName : ((entityObject) ? entityObject.model : null);

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
/*
* Bind/Attach the Entity to Model.
* @param {string} modelName => name of the model
* @param {string} element => directory to search the *-datasources.json file. 
* @param {object} entity => name of the model
* @return {void} 
*/
Routes = (route, entityName) => {
  let routes = [];
  if (!(route)){
    let entity = Entity.collection.byEntity(entityName);
    if (entity.routes){
      entity.routes.forEach((element) => {
        routes.push(RequireObject(element));  
      });
    };
  } else {
    routes.push(route);
  }
  return routes;
};

export { Bind, Routes }