import { Model, EntityBase } from 'loopback-model-binder';

export default class Occupations extends EntityBase {

  constructor() {
    super();
  }

  getOccupations(next){
    Model.instance.Mongo.Occupations.find({}, (err, data) => {
      next(null, data);
    });    
  }

}