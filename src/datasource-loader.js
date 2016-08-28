/// <reference path="../typings/index.d.ts" />

import { isFunction, GetModelSchema, toSpinalCase, ReadGlob, PathJoin } from './utils';
import * as Rx from 'rx';

let dataSourceLoader = {
  /**
  * Load Datasources or attach to strongloop app.
  * @param {app} => strongloop app 
  * @param {dsDirPath} => directory to search the *-datasources.json file. 
  * @return {Observable} 
  */
  load: (app, dsDirPath) => {
    let loadDataSource;
    let datasources = ReadGlob(`${dsDirPath}/*-datasources.json`);
    if (datasources){
      if (datasources.length > 1){
        throw new Error(`Only one (1) datasources file, should be in ${dsDirPath}`);
      }   
      loadDataSource = Rx.Observable.from(datasources)
        .flatMap((dataSource) => {
          return getDataSourceKeys(dataSource);
        }).flatMap((value) => {
          return attachDataSource(app, value);
        });
    }
    return loadDataSource;
  }
},
getDataSourceKeys = (dataSource) => {
  return Rx.Observable.create((observer) => {
    let ds = require(dataSource);
    let dsKeys = Object.keys(ds);
    observer.onNext({ dsKeys: dsKeys, dataSource: ds });
    observer.onCompleted();
  });    
},
attachDataSource = (app, value) => {
  let length = value.dsKeys.length;
  let newDataSources = [];
  return Rx.Observable.create((observer) => {
    for (let i = 0; i < length; i++){
      let dsKey = value.dsKeys[i];
      app.dataSource(dsKey, value.dataSource[dsKey]);
      if (app.dataSources[dsKey]){
        newDataSources.push(dsKey);
      }
    }
    observer.onNext(newDataSources); 
    observer.onCompleted();
  });
},
loadMainDataSource = (app, dsDirPath, modelLoaderCallback) => {
  let modelName = toSpinalCase(GetModelSchema(dsDirPath).name);
  let pathJoin = PathJoin(dsDirPath, `./${modelName}-datasources.json`);
  if (fs.existsSync(pathJoin)) {
    let dataSources = ReadGlob(pathJoin);
    if (dataSources){
      let dataSource = require(dataSources[0]);
      let dsKeys = Object.keys(dataSource);
      if (dsKeys.length > 1){
        throw new Error(`Should only (1) dataSource in ${pathJoin}`);
      }
      let dskey = dsKeys[0], newDataSources = [];
      app.dataSource(source, dataSource[dskey]); 
      if (app.dataSources[dskey]){
        newDataSources.push(dskey);
      }
      if (modelLoaderCallback && isFunction(modelLoaderCallback)){
        modelLoaderCallback(newDataSources);
      }
    }
  } else {
    throw new Error(`Should have model datasource, Format: <your-model-name>-datasources.json`);
  }
};

export { dataSourceLoader }
