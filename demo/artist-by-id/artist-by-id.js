import { Model, EntityBase } from 'loopback-model-binder';

export default class Artist extends EntityBase {
 
  constructor() {
    super('Artist');
  }

  getById(id, next){
    Model.instance.Artist.getArtistById(id, next);
  }

  getByIdBefore(ctx, next){
    next();
  }
  
  getByIdAfter(ctx, result, next){
    next();
  }

  getByIdError(ctx, next){
    next();
  }
  
}