# loopback-model-bider
Loopback Model Binder for ES6

* Helps to write clean code.
* Developer can focus on application logic.
* Can use ES5 or ES6 code.

## Usage

Install with npm

```
npm install loopback-model-binder --save
```

## Steps
* Copy spotify and mongo-data folder from demo folder to your models folder
* Create boot file for your demo api.
```javascript
import { modelBootstrap } from 'loopback-model-binder';
import * as path from 'path';

module.exports = (app) => {
  // the path should be the root path of your model schema
  modelBootstrap(app, path.join(__dirname, '../models'));
};
```
* Run your strongloop app.

#### Model schema [you-custom-name]-model.json 
When creating model json file, it should have -model.json suffix.

* mongodb.collections is an array of your collections in mongodb database.
* should be in PascalCase
``` json
{
  "name": "Mongo",
  "base": "PersistedModel",
  "mongodb": {
    "collections": ["MaritalStatus", "Occupations"]
  },
  "http": {
    "path": "mongo"
  }
}
```

#### Datasources schema [your-custom-name]-datasources.json
When creating datasources json file, it should have -datasources.json suffix.

```json
{
  "MongoData": {
    "connector": "mongodb",
    "debug": "true",
    "host": "localhost",
    "database": "sampledb",
    "port": 27017,
    "username": "root",
    "password": "*****"
  }
}
```

#### Override configs in you custom boot file. 
Please see in folder demo/mongo-data/mongo-boot.js

```javascript
  /// By default, it will read binder.config.js file, if exist.
  /// else loopback-model-binder has default configs.
  /// Please see in folder src/model-boot.js 
  get configs(){
    /// create a copy of the base configs
    let _configs = JSON.parse(JSON.stringify(super.configs));
    /// set the seed.isSeed value to false
    /// setting to false will not execute the seed
    _configs.seed.isSeed = false;

    /// return the new configs
    return _configs;
  }
```


