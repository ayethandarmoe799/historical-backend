import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleMapModule } from './google-map/google-map.module';
import { GoogleMapsService } from './google-map/google-map.service';
import { GoogleMapsController } from './google-map/google-map.controller';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env'],
  }),
  GoogleMapModule,

],
  controllers: [AppController, GoogleMapsController],
  providers: [AppService, GoogleMapsService],
})
export class AppModule {}
