import { Module } from '@nestjs/common';
import { GoogleMapsService } from './google-map.service';
import { GoogleMapsController } from './google-map.controller';

@Module({
  controllers: [GoogleMapsController],
  providers: [GoogleMapsService],
})
export class GoogleMapModule {}
