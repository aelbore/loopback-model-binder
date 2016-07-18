/// <reference path="../typings/index.d.ts" />

import ModelBase from './model-base';
import { BinderHelper } from './utils';
import * as glob from 'glob';

export default class ModelBinder {

  constructor(Configs){
    BinderHelper.init(Configs, __dirname);
  }

  bind(){
    let configFiles = BinderHelper.files;
    if (configFiles){
      configFiles.forEach((element) => {
        let files = glob.sync(element.include, { dot: true, ignore: element.ignore });
        files.forEach((file) => {
          let model = require(file).default;
          if(typeof model === 'function'){
            let instance = new model();
            if (instance instanceof ModelBase){
              instance.onInit();  
            }
          }
        });
      }, this);
    }
  }

}