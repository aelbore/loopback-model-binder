import { Model, EntityBase } from 'loopback-model-binder';
import { SeveralArtistExt } from './several-artists-extras';
import RestMongoByIdTransform from './several-artists-transform';

export default class ServeralArtists extends EntityBase {
 
  constructor() {
    super();
  }

  getSeveralArtists(ids, next){
    Model.instance.RestMongo
      .getSpotifySeveralArtists(ids, (err, response, ctx) => {
        next(null, response);
      });
  }
  
  getSeveralArtistsAfter(ctx, result, next){
    let transform = new RestMongoByIdTransform();
    let artists = transform.mapTo(result.artists);

    SeveralArtistExt.execute(artists)
      .subscribe((data) => {
        ctx.result = data;
        next();
      });
  }

}