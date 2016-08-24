import { Model } from 'loopback-model-binder';
import * as Rx from 'rx';

let SeveralArtistExt = {
  execute: (artists) => {
    return Rx.Observable.from(artists)
      .flatMap((artist) => {
        let isTotalLenght = ((artists.indexOf(artist) + 1) === artists.length);
        return findOrCreate(artist, isTotalLenght);
      }).flatMap((isTotalLenght) => {
        return getMongoArtist(isTotalLenght);
      });  
  }
};

/**
* Check if the data is exist in the mongodb Database
* else Insert it.
* @param {artist} => item
* @param {isTotalLenght} => counter 
* @return {Observable} 
*/
let findOrCreate = (artist, isTotalLenght) => {
  return Rx.Observable.create((observer) => {
    Model.instance.RestMongo.SeveralArtist
      .findOrCreate({ where: { artistId: artist.artistId } }, 
        artist, 
        (error, instance, created) => {
          if (error) console.log(error);
          if (created){
            console.log(`Artist ${artist.name} was created.`);
          }
          if (isTotalLenght){
            observer.onNext(isTotalLenght);
            observer.onCompleted();
          }
        });           
  });
},
/**
* Query to mongodb 
* @param {length} => item
* @param {isTotalLenght} => counter 
* @return {Observable} 
*/
getMongoArtist = (length) => {
  return Rx.Observable.create((observer) => {
    Model.instance.RestMongo
      .SeveralArtist.find({}, (err, data) => {
        observer.onNext(data);
        observer.onCompleted();
      });
  });  
};

export { SeveralArtistExt }