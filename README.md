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
* Copy all folders from demo folder to your models folder
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
#### Extend Model 
* RestMongoData - child datasource (name of the datasource) 
* collections - list of mongodb collections
``` json
{
  "name": "RestMongo",
  "plural": "RestMongos",
  "base": "PersistedModel",
  "http": {
    "path": "rest-mongo"
  },
  "extends": {
    "RestMongoData": {
      "collections": ["SeveralArtist"]
    }
  }
}
```
* Note: if you want to extend Rest datasource no need to add "extends" property, just configure you datasource as child.
* Please see [rest-mongo-model.json](https://github.com/aelbore/loopback-model-binder/blob/master/demo/rest-mongo/rest-mongo-model.json)

#### Datasources schema [your-custom-name]-datasources.json
* When creating datasources json file, it should have -datasources.json suffix.
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
* Attach multiple datasources to the model
  * Separate into multiple files. (should be 1 datasource in each file)
    * [model-name]-datasources.js - this is the parent datasource.
    * [custom-datasource-name]-datasources.json - child datasource
  * In one(1) datasource file.
    * MongoRestData - parent/main datasource 
    * mongoSpotifyRest - child datasource
```json
  {
    "MongoRestData": {
      "connector": "mongodb",
      "debug": "true",
      "host": "localhost",
      "database": "mongorest",
      "port": 27017,
      "username": "root",
      "password": ""
    },
    "mongoSpotifyRest": {
      "connector": "rest",
      "debug": "true",
      "options": {
        "headers": {
          "content-type": "application/json"
        },
        "strictSSL": false
      },
      "operations": [
        { 
          "template": {
            "method": "GET",
            "url": "https://api.spotify.com/v1/artists?ids={ids}"
          },
          "functions": {
            "getSpotifySeveralArtists": ["ids"]
          }
        }
      ]
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

#### Function or Class 
```javascript
import { modelBootstrap, ModelBoot, EntityBase, Model, ModelSeed } 'loopback-model-binder';
```

### modelBootstrap(app, bootRootDir, isEnable)
  * `app` `{Object}` strongloop/loopback app object.
  * `bootRootDir` `{String}` root Directory of your custom boot file.
  * `isEnable` `{Boolean}` Enable or Disable remoteMethods by default = false

### ModelBoot 
  * Base class to create custom boot file. Please see 
  
### EntityBase
  * Base class to create entity/functionality

### Model
  * `Model.instance.[YourModel]` - you access the Loopback Model functionalities
  
### ModelSeed
  * Base class to create Seed data in MongoDB
