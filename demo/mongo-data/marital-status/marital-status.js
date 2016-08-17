import { Model, EntityBase } from 'loopback-model-binder';

export default class MaritalStatus extends EntityBase {

  constructor() {
    super();
  }

  getMaritalStatus(next){
    Model.instance.Mongo.MaritalStatus.find({}, (err, data) => {
      next(null, data);
    });
  }

  getMaritalStatusByValue(value, next){
    Model.instance.Mongo.MaritalStatus
      .find({ where: { value: value } }, 
        (err, data) => {
          next(null, data);
        });   
  }

}