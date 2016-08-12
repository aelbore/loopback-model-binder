/// <reference path="../typings/index.d.ts" />

import { Model, EntityBase, Entity } from './index';
import { BinderHelper, RequireObject, globArray } from './utils';
import * as glob from 'glob';

let ModelBinder = {
  bindTo: (config, model) => {
    BinderHelper.init(config);
    let configFiles = BinderHelper.files;
    if (configFiles){
      configFiles.forEach((element) => {
        let files = glob.sync(element.include, { dot: true, ignore: element.ignore });
        files.forEach(file => create(file, model));
      });
    }
  }
},
create = (file, model) => {
  var _model = RequireObject(file);
  if (_model) {
    if(typeof _model === 'function'){
      let instance = new _model();
      if (instance instanceof EntityBase){
        Model.instance.create(model);
        addEntity(model.modelName, instance.constructor.name, file);
        instance.onInit();  
      }
    }
  }
},
addEntity = (modelName, entityName, file) => {
  let fileWithOutfileName = file.substring(0, file.lastIndexOf("/"));
  let files = globArray([
      `${fileWithOutfileName}/*.route.js`, 
      `${fileWithOutfileName}/*.route.json`
  ]);
  Entity.collection.add(modelName, entityName, files);
};

export { ModelBinder }