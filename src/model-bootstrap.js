import { EnableDisableRemoteMethods } from './utils';
import { Model } from './index';

let modelBootstrap = (app) => {
  let models = Object.getOwnPropertyNames(Model.instance)
  models.forEach((model) => {
    let appModel = app.models[model];
    if (appModel){
      EnableDisableRemoteMethods(appModel, false);  
    }
  });
};

export { modelBootstrap }