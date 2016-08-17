/// <reference path="../typings/index.d.ts" />

let entities = Symbol();
let singleton = Symbol();

export default class Entity {
  constructor() {
    this[entities] = new Array();
  }

  static get collection(){
    if (!this[singleton]){
      this[singleton] = new Entity();
    } 
    return this[singleton];    
  }

  add(model, entity, routes){
    this[entities].push({ model: model, entity: entity, routes: routes });
  }

  get entities(){
    return this[entities];
  }

  byEntity(entityName) {
    let values = this.entities.filter((o) => {
      return o.entity === entityName;
    });
    return (values) ? values[0] : null;
  }
}