import * as path from 'path';
import * as glob from 'glob';

let BinderHelper = {
  init: (config, rootDir) => {
    let _config = JSON.parse(JSON.stringify(config));

    _config.rootDir = _config.rootDir ? _config.rootDir : rootDir;

    _config.files.forEach((file) => {
      let ignores = [];
      file.include = path.join(_config.rootDir, file.include);
      file.ignore.forEach((i) => {
        ignores.push(path.join(_config.rootDir, i));
      });
      file.ignore = ignores;
      BinderHelper.files = [];
      BinderHelper.files.push(file);
    });
  },
  files: []
},
Hook = (Model, ModelObject, FnName) => {
    let FnAfter = ModelObject[`${FnName}After`],
      FnError = ModelObject[`${FnName}Error`],
      FnBefore = ModelObject[`${FnName}Before`];

  if (FnAfter){
     Model.afterRemote(FnName, FnAfter);
  }

  if (FnError){
    Model.afterRemoteError(FnName, FnError)
  }

  if (FnBefore){
    Model.beforeRemote(FnName, FnBefore);
  }
},
EnableDisableRemoteMethods = (model, isEnable) => {
  let methods = GetMethodsFromModel(model);
  methods.forEach((element) => {
    if (model[element]){
      if (model[element].hasOwnProperty('isEnable')) {
        model.disableRemoteMethod(element, !(model[element]['isEnable'])); 
      } else {
        model.disableRemoteMethod(element, !(isEnable)); 
      } 
    }
  }, this);
  model.disableRemoteMethod('updateAttributes', false);  
},
GetMethodsFromModel = (model) => {
  let models = [];
  let fromMixins = (model._mixins && (!isFunction(model._mixins))) ? model._mixins.map(mixin => Object.keys(mixin))[0] : [];
  let fromShared = model.sharedClass.methods().map(sharedMethod => sharedMethod.name);  
  
  fromMixins.forEach((mixin) => { models.push(mixin); });
  fromShared.forEach((shared) => { models.push(shared); })

  return models;  
},
randomId = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 20; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
},
RequireObject = (file) => {
  let obj = require(file).default;
  return obj ? obj : require(file);
},
AddDataSourcesTo = (dsPath, dsObject) => {
  if (dsPath){
    let files = glob.sync(`${dsPath}/**/*datasources.json`);
    if (files){
      files.forEach((file) => {
        let dsSource = require(file);
        if (dsSource){
          Object.assign(dsObject, dsSource); 
        }   
      });
    }
  }
},
AddModelConfigTo = (modelConfigPath, modelConfigObject) => {
  if (modelConfigPath){
    let files = glob.sync(`${modelConfigPath}/**/*-config.json`);
    console.log(files);
    if (files){
      files.forEach((file) => {
        let modelConfig = require(file);
        if (modelConfig){
          Object.assign(modelConfigObject, modelConfig); 
        }   
      }); 
    }   
  }
},
isFunction = (value) => {
  return typeof value === 'function';
};

export { 
  BinderHelper, 
  Hook, 
  EnableDisableRemoteMethods, 
  GetMethodsFromModel,
  randomId,
  RequireObject,
  AddDataSourcesTo,
  AddModelConfigTo,
  isFunction
}