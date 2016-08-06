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
  let fileWithOutfileName = file.substring(0, file.lastIndexOf("/"));
  let files = globArray([
      `${fileWithOutfileName}/*.route.js`, 
      `${fileWithOutfileName}/*.route.json`
  ]);
  Model.instance.routes = {};
  let name = instance.constructor.name;
  if (!(Model.instance.routes.hasOwnProperty(name))){
    Model.instance.routes[name] = files;
  }
},
globArray = (patterns, options) => {
  var i, list = [];
  if (!Array.isArray(patterns)) {
    patterns = [patterns];
  }

  patterns.forEach(function (pattern) {
    if (pattern[0] === "!"){
      i = list.length-1;
      while( i > -1) {
        if (!minimatch(list[i], pattern)) {
          list.splice(i,1);
        }
        i--;
      }
    }
    else {
      var newList = glob.sync(pattern, options);
      newList.forEach(function(item){
        if (list.indexOf(item)===-1) {
          list.push(item);
        }
      });
    }
  });

  return list;
}

export { ModelBinder }