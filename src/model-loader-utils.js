/// <reference path="../typings/index.d.ts" />

import { toSpinalCase, ReadGlob, PathJoin, RequireObject, isFunction } from './utils';
import ModelSeed from './model-seed';
import * as async from 'async';

let SeedData = (seed, model, collection, dataSource) => {
  if (seed.isSeed){
    let files = ReadGlob(PathJoin(seed.rootDir, `./${toSpinalCase(collection)}.js`));
    if (files){
      async.each(files, 
        (file) => {
          let seed = RequireObject(file);
          if (seed && isFunction(seed)){ 
            let seedObject = new seed(model, dataSource);
            if (seedObject instanceof ModelSeed){
              seedObject.execute(); 
            }
          }
        }, (error) => {
          console.log(error);
        });
    }
  }
};

export { SeedData };