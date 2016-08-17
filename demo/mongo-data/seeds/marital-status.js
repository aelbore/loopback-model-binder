import { ModelSeed } from 'loopback-model-binder';

export default class MaritalStatusSeed extends ModelSeed  {

  constructor(Model, DataSource){
    super(Model, DataSource);
  }

  execute(){
    let maritalStatus = require('./marital-status.json');
    maritalStatus.forEach((obj) => {
      this.migrate(obj, {
         where: { value: obj.value } 
      }, {
        modelName: 'MaritalStatus',
        length: maritalStatus.length
      }); 
    }, this);
  }

}