# loopback-model-bider
Loopback Model Binder for ES6 classes

## Usage

Install with npm

```
npm install loopback-model-binder --save
```

## Steps
* Create spotify folder in your models folder.
* Copy all files in demo folder into spotify folder.
* Create boot file for your spotify api.
```javascript
import { modelBootstrap } from 'loopback-model-binder';
import * as path from 'path';

module.exports = (app) => {
  // the path should be the root path of your model schema
  modelBootstrap(app, path.join(__dirname, '../models/spotify'));
};
```
* Run your strongloop app.
