import { isFunction, GetModelSchema, toSpinalCase, ReadGlob, PathJoin, BaseName, RequireObject } from './utils';
import { DataSourceConfig } from './index';
import * as Rx from 'rx';
import * as jsonTemplaterObject from 'json-templater/object';

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
    if (datasources) {
      loadDataSource = DataSource(app, dsDirPath, datasources);
    }
    return loadDataSource;
  }
},
  DataSource = (app, dsDirPath, dataSources) => {
    let modelName = toSpinalCase(GetModelSchema(dsDirPath).name);
    let fileName = `${modelName}-datasources.json`;
    let ds = getParentDataSource(fileName, dataSources);
    let newDataSources = [];

    return Rx.Observable.from(dataSources)
      .flatMap((dataSource) => {
        return Rx.Observable.create((observer) => {
          if (dataSources.length > 1 && !(ds)) {
            let error = new Error(`Should have ${fileName} on ${dsDirPath} directory for multiple dataSources.`);
            observer.onError(error);
          }
          let dsConfig = DataSourceConfig.instance;
          let source = jsonTemplaterObject(RequireObject(dataSource), dsConfig.config);
          let dsKeys = Object.keys(source);
          if (ds && (dataSources.length > 1) && (dsKeys && dsKeys.length > 1)) {
            let _error = new Error(`File ${ds} should have only one(1) dataSource.`);
            observer.onError(_error);
          }
          dsKeys.forEach((dsKey) => {
            app.dataSource(dsKey, source[dsKey]);
            if (app.dataSources[dsKey]) {
              newDataSources.push(dsKey);
            }
          });
          if ((dataSources.indexOf(dataSource) + 1) === dataSources.length) {
            observer.onNext(newDataSources);
            observer.onCompleted();
          }
        });
      });
  },
  getParentDataSource = (fileName, dataSources) => {
    let sources = dataSources.filter(ds => {
      return ((BaseName(ds) === fileName));
    });
    return (sources) ? sources[0] : null;
  };

export { dataSourceLoader }
