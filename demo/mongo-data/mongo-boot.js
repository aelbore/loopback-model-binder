import { ModelBoot } from 'loopback-model-binder';

export default class MongoBoot extends ModelBoot {
  constructor(app) {
    super(app, __dirname);
  }
}