import { Model, EntityBase } from 'loopback-model-binder';

export default class ArtistById extends EntityBase {
 
  constructor() {
    super();
  }

  getById(id, next){
    Model.instance.Artist.getArtistById(id, next);
  }

  getByIdBefore(ctx, modelInstance, next){
    console.log(`[Artist.getById.beforeRemote]`);
    next();
  }
  
  getByIdAfter(ctx, result, next){
    console.log(`[Artist.getById.afterRemote]`);
    next();
  }

  getByIdError(ctx, next){
    console.log(`[Artist.getById.afterRemoteError]`);
    next();
  }
  
}