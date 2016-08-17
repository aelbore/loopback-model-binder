import { ModelSeed } from 'loopback-model-binder';

export default class OccupationsSeed extends ModelSeed  {

  constructor(Model, DataSource) {
    super(Model, DataSource);
  }

  execute(){
    let occupations = require('./occupations.json');
    occupations.forEach((obj) => {
      this.migrate(obj, {
         where: { value: obj.value } 
      }, {
        modelName: 'Occupations',
        length: occupations.length
      });
    }, this);
  }

}