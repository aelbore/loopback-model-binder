import { modelLoader } from './model-loader';
import * as Rx from 'rx';

const IGNORE_FILES = [
  "./**/*.route.js",
  "./index.js",
  "./*-binder.config.js",
  "./*-boot.js",
  "./*-datasources.json",
  "./*-model.json"
];

let modelBootUtils = {
  loader: (app, rootDir, dataSources, configs) => {
    return Rx.Observable.create((observer) => {
      modelBootUtils
        .load(app, rootDir, dataSources, configs)
        .subscribe((value: any) => {
          modelBootUtils.extend(app, value.dataSources, value.configs);
          observer.onNext(value.modelName);
          observer.onCompleted();
        });
    });
  },
  load: (app, rootDir, dataSources, configs) => {
    let localConfigs = Object.assign({}, configs);
    localConfigs.dataSource = dataSources[0];
    localConfigs.rootDir = rootDir;
    return modelLoader.load(app, localConfigs)
      .flatMap((modelName) => {
        return Rx.Observable.create((observer) => {
          observer.onNext({
            configs: localConfigs,
            modelName: modelName,
            dataSources: dataSources
          });
          observer.onCompleted();
        });
      });
  },
  extend: (app, dataSources, configs) => {
    if (dataSources.length > 1) {
      for (let i = 1; i < dataSources.length; i++) {
        modelLoader.extends(app, dataSources[i], configs);
      }
    }
  }
};

export { modelBootUtils, IGNORE_FILES }