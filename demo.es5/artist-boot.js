var ModelBoot = require('loopback-model-binder').ModelBoot;

var ArtistBoot = function(app) {
  ModelBoot.call(this, app, __dirname);
}

ArtistBoot.prototype = Object.create(ModelBoot.prototype);
ArtistBoot.prototype.constructor = ModelBoot;

module.exports = ArtistBoot;