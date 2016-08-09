import { ModelBoot } from 'loopback-model-binder';

export default class ArtistBoot extends ModelBoot {
  constructor(app) {
    super(app, __dirname);
  }
}