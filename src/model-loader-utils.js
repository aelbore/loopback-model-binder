/// <reference path="../typings/index.d.ts" />

import { toSpinalCase, ReadGlob, PathJoin, RequireObject, isFunction } from './utils';
import ModelSeed from './model-seed';
import * as Rx from 'rx';

/// TODO: optional to seed specific Model or Collections
///   It should have Model/Collections list that exempt 
///   from seeding data
let SeedData = (seed, model, collection, dataSource) => {
  if (seed.isSeed){
    let files = ReadGlob(PathJoin(seed.rootDir, `./${toSpinalCase(collection)}.js`));
    if (files){
      let RxNodeCallBack = Rx.Observable.fromNodeCallback(seeFile);
      Rx.Observable
        .for(files, file => RxNodeCallBack(file, model, dataSource))
        .subscribe(() => {});
    }
  }
}, 
seeFile = (file, model, dataSource) => {
  let seed = RequireObject(file);
  if (seed && isFunction(seed)){ 
    let seedObject = new seed(model, dataSource);
    if (seedObject instanceof ModelSeed){
      seedObject.execute(); 
    }
  }
};

export { SeedData };