import * as path from 'path';

let isFunction = (value) => {
  return typeof value === 'function';
};

let BinderHelper = {
  init: (config, rootDir) => {
    let _config = JSON.parse(JSON.stringify(config));

    _config.rootDir = _config.rootDir ? _config.rootDir : rootDir;

    if (!config.isRoot){
      _config.files.forEach((file) => {
        let ignores = [];
        file.include = path.join(_config.rootDir, file.include);
        file.ignore.forEach((i) => {
          ignores.push(path.join(_config.rootDir, i));
        });
        file.ignore = ignores;
        BinderHelper.files.push(file);
      });
    } else {
      BinderHelper.files = config.files;
    }
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
  let methods = getMethodsFromModel(model);
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
};

export { 
  BinderHelper, 
  Hook, 
  EnableDisableRemoteMethods, 
  GetMethodsFromModel 
}