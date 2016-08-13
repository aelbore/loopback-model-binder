/// <reference path="../typings/index.d.ts" />

import { EnableDisableRemoteMethods, RequireObject, isFunction } from './utils';
import { Model, ModelBoot } from './index';
import * as glob from 'glob';
import * as fs from 'fs';

let modelBootstrap = (app, bootRootDir = __dirname, isEnable = false) => {
  let bootFiles = glob.sync(`${bootRootDir}/**/*-boot.js`);
  if (bootFiles){
    bootFiles.forEach((element) => {
      let bootFile = RequireObject(element);
      console.log(bootFile);
      if (bootFile){
        if (isFunction(bootFile)){
          let modelBoot = new bootFile(app);
          if (modelBoot instanceof ModelBoot){
            modelBoot.onInit();
          }
        }
      }  
    });
  }
  let models = Object.getOwnPropertyNames(Model.instance);
  if (models){
    models.forEach((model) => {
      let appModel = app.models[model];
      if (appModel){
        EnableDisableRemoteMethods(appModel, isEnable);  
      }
    });
  }
};

export { modelBootstrap }