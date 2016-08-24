import { ModelSeed } from 'loopback-model-binder';

export default class SeveralArtistSeed extends ModelSeed  {

  constructor(Model, DataSource){
    super(Model, DataSource);
  }

  execute(){
    let severalArtists = require('./several-artist.json');
    severalArtists.forEach((obj) => {
      this.migrate(obj, {
         where: { artistId: obj.artistId } 
      }, {
        modelName: 'SeveralArtist',
        length: severalArtists.length
      }); 
    }, this);
  }

}