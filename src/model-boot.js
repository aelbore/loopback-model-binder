import { modelLoader } from './model-loader';
import { dataSourceLoader } from './datasource-loader';

let app = Symbol();
let rootDir = Symbol();

/**
 * Boots the Model/Datasource that you create
 * @class ModelBoot
 */
export default class ModelBoot {

  /**
   * Creates an instance of ModelBoot.
   * @param {any} App => strongloop application object
   * @param {any} RootDir => root directory of the model and dataSource
   */
  constructor(App, RootDir) {
    this[app] = App;
    this[rootDir] = RootDir;
  }

  /**
   * Initialize the datasource and model
   */
  onInit(){
    dataSourceLoader.load(this[app], this[rootDir], 
      (dataSource) => {
        modelLoader.load(this[app], this[rootDir], dataSource);
      });
  }

}