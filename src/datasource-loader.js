import * as glob from 'glob';

let dataSourceLoader = {
  load: (app, dsDirPath) => {
    let datasources = glob.sync(`${dsDirPath}/*datasources.json`);
    if (datasources){
      datasources.forEach((datasource) => {
        let dataSources = require(datasource);
        let sources = Object.keys(dataSources);
        sources.forEach((source) => {
          if (source){ app.dataSource(source, dataSources[source]); }
        });
      });
    }
  }
};

export { dataSourceLoader }
