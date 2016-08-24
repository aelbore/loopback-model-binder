
export default class RestMongoByIdTransform {

  constructor() {
  }

  map(obj){
    return {
      artistId: obj.id,
      name: obj.name, 
      popularity: obj.popularity,
      type: obj.type
    }
  }

  mapTo(data){
    let fn = ((obj) => {
      return this.map(obj);
    }).bind(this);
    return data.map(fn);    
  }

}