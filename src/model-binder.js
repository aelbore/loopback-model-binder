/// <reference path="../typings/index.d.ts" />

import { Model, EntityBase } from './index';
import { BinderHelper, RequireObject } from './utils';
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
        getRoutes(instance, file);
        instance.onInit();  
      }
    }
  }
},
getRoutes = (instance, file) => {
  /// TODO: it should support multiple routes in 1 file.
  ///   So as of now 1 route should be in 1 file.
  let fileWithOutfileName = file.substring(0, file.lastIndexOf("/"));
  let routePaths = `${fileWithOutfileName}/*.route.js`;
  let files = glob.sync(routePaths);
  Model.instance.routes = {};
  let name = instance.constructor.name;
  if (!(Model.instance.routes.hasOwnProperty(name))){
    Model.instance.routes[name] = files;
  }
}

export { ModelBinder }