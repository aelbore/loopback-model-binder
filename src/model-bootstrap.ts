import { EnableDisableRemoteMethods, RequireObject, isFunction, ReadGlob } from './utils';
import ModelBoot from './model-boot';
import * as Rx from 'rx';

let modelBootstrap = (app, bootRootDir = __dirname, isEnable = false) => {
  let bootFiles = ReadGlob(`${bootRootDir}/**/*-boot.js`);
  Rx.Observable.from(bootFiles)
    .flatMap((element) => {
      return onInitBootFile(app, element);
    }).subscribe((modelName) => {
      let appModel = app.models[modelName];
      if (appModel) {
        EnableDisableRemoteMethods(appModel, isEnable);
      }
    });
},
  onInitBootFile = (app, bootFile) => {
    return Rx.Observable.create((observer) => {
      let boot = RequireObject(bootFile);
      if (boot && isFunction(boot)) {
        let modelBoot = new boot(app);
        if (modelBoot instanceof ModelBoot) {
          modelBoot.onInit()
            .subscribe((modelName) => {
              observer.onNext(modelName);
              observer.onCompleted();
            }, (error) => {
              observer.onError(error);
            });
        }
      }
    });
  };

export { modelBootstrap }