import { Model, EntityBase } from 'loopback-model-binder';

export default class RelatedArtist extends EntityBase {

  constructor(){
    super();
  }

  getRelatedArtistById(id, next){
    Model.instance.Artist.getSpotifyRelatedArtistById(id, next);
  }

  getArtistTopTracks(id, country, next){
    Model.instance.Artist
      .getSpotifyArtistTopTracks(id, country, next);
  }

}

