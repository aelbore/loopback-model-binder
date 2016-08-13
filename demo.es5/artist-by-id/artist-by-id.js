var Model = require('loopback-model-binder').Model;
var EntityBase = require('loopback-model-binder').EntityBase;

var ArtistById = (function(){
  function ArtistById(){
    EntityBase.call(this);
  }

  ArtistById.prototype = Object.create(EntityBase.prototype);
  ArtistById.prototype.constructor = EntityBase;

  ArtistById.prototype.getById = function(id, next){
    Model.instance.Artist.getArtistById(id, next);
  };

  ArtistById.prototype.getByIdBefore = function(ctx, modelInstance, next){
    console.log(`[Artist.getById.beforeRemote]`);
    next();
  };

  ArtistById.prototype.getByIdAfter = function(ctx, result, next){
    console.log(`[Artist.getById.afterRemote]`);
    next();
  };

  ArtistById.prototype.getByIdError = function(ctx, next){
    console.log(`[Artist.getById.afterRemoteError]`);
    next();
  };

  return Artist;
})();

module.exports = ArtistById;