import { EnableDisableRemoteMethods } from './utils';

let modelBootstrap = (app) => {
  var models = app.models();
  models.forEach((model) => {
    EnableDisableRemoteMethods(model, false);  
  });
};

export { modelBootstrap }