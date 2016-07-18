import { EnableDisableRemoteMethods } from './utils';
import { Model } from './index';

let modelBootstrap = (app) => {
  let models = Object.getOwnPropertyNames(Model.instance);
  models.forEach((model) => {
    EnableDisableRemoteMethods(app.models[model], false);  
  });
};

export { modelBootstrap }