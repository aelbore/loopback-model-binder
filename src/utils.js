import * as path from 'path';
import * as glob from 'glob';
import * as fs from 'fs';
import { GetModelSchema } from './model-utils';

let BinderHelper = {
  init: (config, rootDir) => {
    let _config = Object.assign({}, config);

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
},
ObserveReadableSteam = (file) => {
  return RxNode.fromReadableStream(fs.createReadStream(file));
},
ReadGlob = (file, options = null) => {
  return glob.sync(file, options);
},
PathJoin = (rootDir, filePath) => {
  return path.join(rootDir, filePath);
},
ReadFileSync = (rootDir, filePath) => {
  return fs.readFileSync(path.join(rootDir, filePath), 'UTF-8');
},
PropertyListChanged = (sourceObj, dbObj) => {
  let propertiesListChanged = [];
  let properties = Object.getOwnPropertyNames(sourceObj);
  properties.forEach((property) => {
    if (dbObj[property] !== sourceObj[property]){
      propertiesListChanged.push(property);
    }
  });  
  return propertiesListChanged;
},
toSpinalCase = (str) => {
  return str.replace(/(?!^)([A-Z])/g, ' $1')
            .replace(/[_\s]+(?=[a-zA-Z])/g, '-').toLowerCase();
};

export { 
  PropertyListChanged,
  ReadFileSync,
  PathJoin,
  ReadGlob,
  BinderHelper, 
  Hook, 
  EnableDisableRemoteMethods, 
  GetMethodsFromModel,
  randomId,
  RequireObject,
  AddDataSourcesTo,
  AddModelConfigTo,
  isFunction,
  globArray,
  ObserveReadableSteam,
  toSpinalCase,
  GetModelSchema
}