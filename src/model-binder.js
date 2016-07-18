/// <reference path="../typings/index.d.ts" />

import { Model, ModelBase } from './index';
import { BinderHelper } from './utils';
import * as glob from 'glob';

let ModelBinder = {
  bindTo: (config, model) => {
    BinderHelper.init(config, __dirname);
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
  let _model = require(file).default;
  if (_model) {
    if(typeof _model === 'function'){
      let instance = new _model();
      if (instance instanceof ModelBase){
        Model.instance.create(model);
        instance.onInit();  
      }
    }
  }
};

export { ModelBinder }