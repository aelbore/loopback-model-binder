import { ModelBoot } from 'loopback-model-binder';

export default class MongoRestBoot extends ModelBoot {
  constructor(app) {
    super(app, __dirname);
  }
}