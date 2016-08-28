/// <reference path="../typings/index.d.ts" />

import Model from './model';
import Entity from './entity-collections';
import { isFunction, RequireObject, Hook } from './utils';
import * as Rx from 'rx';

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
  let methods = Object.keys(element).filter((o) => { return o !== 'isEnable' });
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
* Get the Routes for entity
* @param  {object | array} route => route provided
* @param  {string} entityName => name of the entity that has routes
* @return {Observable} 
*/
Routes = (route, entityName) => {
  return Rx.Observable.create((observer) => {
    let routes = [];
    if (route) { routes.push(route); }
    observer.onNext(routes); observer.onCompleted();
  }).flatMap((routes) => { 
    return getRoutes(routes, entityName) 
  });
},
getRoutes = (routes, entityName) => {
  return Rx.Observable.create((observer) => {
    if (routes.length < 1){
      let entity = Entity.collection.byEntity(entityName);
      for (let i = 0; i < entity.routes.length; i++){
        routes.push(RequireObject(entity.routes[i]));
      }     
    } 
    observer.onNext(routes); observer.onCompleted();    
  });
};

export { Bind, Routes }