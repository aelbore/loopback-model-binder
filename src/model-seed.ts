import { PropertyListChanged } from './utils';

let _model = Symbol();
let _dataSource = Symbol();
let _createdCounts = Symbol();
let _totalLoop = Symbol();

/**
 * @export
 * Base class for Seed
 */
export default class ModelSeed {

  constructor(Model, DataSource) {
    this[_model] = Model;
    this[_dataSource] = DataSource;
    this[_createdCounts] = 0;
    this[_totalLoop] = 0;
  }

  /**
   * @readonly
   */
  get model() {
    return this[_model];
  }

  /**
   * @readonly
   */
  get dataSource() {
    return this[_dataSource];
  }

  /**
   * Execute the migration it must be implemented.
   */
  execute() {
    throw new Error(`Please implement this method.`);
  }

  /**
   * @param {any} data
   * @param {any} filter
   * @param {any} [options=null]
   */
  migrate(data, filter, options = null) {
    this.model.findOrCreate(filter, data,
      (error, instance, created) => {
        this[_totalLoop]++;
        if (error) console.log(error);
        if (created) {
          this[_createdCounts]++;
          if ((this[_totalLoop] === options.length) && options) {
            console.log(`> Model: ${options.modelName}, ${this[_createdCounts]} record(s) created successfully.`);
          }
        } else {
          if (instance) {
            let propertiesListChanged = PropertyListChanged(data, instance);
            if (propertiesListChanged && propertiesListChanged.length > 0) {
              this.model.upsert(data, (err, model) => {
                if (err) console.log(error);
                console.log(`> list of properties was updated [${propertiesListChanged.join()}].`);
              });
            }
          }
        }
      });
  }

}