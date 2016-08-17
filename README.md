# loopback-model-bider
Loopback Model Binder for ES6 classes

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
