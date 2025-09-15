import { DynamicModule, Module } from '@nestjs/common';
import { Trains } from './models.js';
import { TrainDataController } from './train-data.controller.js';
import { TRAIN_DATA_TOKEN } from './train-data.constants.js';

@Module({})
export class App {
  static withTrains(trains: Trains): DynamicModule {
    return {
      module: App,
      controllers: [TrainDataController],
      providers: [{ provide: TRAIN_DATA_TOKEN, useValue: trains }],
    };
  }
}
