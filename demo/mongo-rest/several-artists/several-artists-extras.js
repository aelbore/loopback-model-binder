

/// <reference path="../../../typings/index.d.ts" />

import { Model } from 'loopback-model-binder';
import * as Rx from 'rx';
import RestMongoByIdTransform from './several-artists-transform';

let SeveralArtistExt = {
  execute: (response) => {
    let artists = response.data;
    return getRestData(response.ids)
      .flatMap((response) => {
        return transformResponse(response.artists);
      }).flatMap((results) => {
        return mergeData(results, artists);
      });   
  }
};

let transformResponse = (response) => {
  return Rx.Observable.create((observer) => {
    let transform = new RestMongoByIdTransform();
    let results = transform.mapTo(response);
    observer.onNext(results);
    observer.onCompleted();
  });  
},
mergeData = (results, artists) => {
  return Rx.Observable.create((observer) => {
    for (let i = 0; i < results.length; i++){
      artists.push(results[i]);
    } 
    observer.onNext(artists);
    observer.onCompleted(); 
  });
},
getRestData = (ids) => {
  return Rx.Observable.create((observer) => {
    Model.instance.MongoRest
      .getSpotifySeveralArtists(ids, (err, response, ctx) => {
        observer.onNext(response);
        observer.onCompleted();
      });
  }); 
};

export { SeveralArtistExt }
