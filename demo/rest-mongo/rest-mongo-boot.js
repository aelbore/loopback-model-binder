import { ModelBoot } from 'loopback-model-binder';

export default class RestMongoBoot extends ModelBoot {
  constructor(app) {
    super(app, __dirname);
  }
}