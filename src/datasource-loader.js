import { isFunction } from './utils';
import * as glob from 'glob';

let dataSourceLoader = {
  /**
  * Load Datasources or attach to strongloop app.
  * @param {app} => strongloop app 
  * @param {dsDirPath} => directory to search the *-datasources.json file. 
  * @return {void} 
  */
  load: (app, dsDirPath, modelLoaderCallback) => {
    let datasources = glob.sync(`${dsDirPath}/*-datasources.json`);
    if (datasources){
      if (datasources.length > 1){
        throw new Error(`Only one (1) datasources file, should be in ${dsDirPath}`);
      }     
      datasources.forEach((datasource) => {
        let dataSources = require(datasource);
        let sources = Object.keys(dataSources);
        if (sources){
          let newDataSources = new Array();
          sources.forEach((source) => {
            if (source){ 
              app.dataSource(source, dataSources[source]); 
              if (app.dataSources[source]){
                newDataSources.push(source);
              }
            }
          });
          if (modelLoaderCallback && isFunction(modelLoaderCallback)){
            modelLoaderCallback(newDataSources);
          }
        }
      });
    }
  }
};

export { dataSourceLoader }
