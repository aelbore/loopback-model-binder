
let GetModelSchema = (rootDir) => {
  let schema;
  let modelSchemas = ReadGlob(`${rootDir}/*-model.json`);
  if (modelSchemas){
    if (modelSchemas.length > 1){
      throw new Error(`Only one (1) model file, should be in ${rootDir}`);  
    }
    schema = require(modelSchemas[0]);
  }   
  return schema;
};

export { GetModelSchema }