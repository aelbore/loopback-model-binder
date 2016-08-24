/// <reference path="../../../typings/index.d.ts" />

import { Model, EntityBase } from 'loopback-model-binder';
import { SeveralArtistExt } from './several-artists-extras';

export default class ServeralArtists extends EntityBase {
 
  constructor() {
    super();
  }

  getSeveralArtists(ids, next){
    Model.instance.MongoRest.SeveralArtist
      .find({}, (err, data) => {
        next(null, { data: data, ids: ids });
      });
  }

  getSeveralArtistsAfter(ctx, result, next){
    SeveralArtistExt.execute(result)
      .subscribe((data) => {
        ctx.result = data;
        next();
      }); 
  }

}