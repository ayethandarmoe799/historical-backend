import { Controller, Get, Query } from '@nestjs/common';
import { GoogleMapsService } from './google-map.service';

@Controller('places')
export class GoogleMapsController {
  constructor(private googleMapsService: GoogleMapsService) {}
  public apiKey = process.env.GOOGLE_MAPS_API_KEY;

  @Get('historical')
  async getHistoricalPlaces(@Query('country') country: string) {
    const places = await this.googleMapsService.findHistoricalPlaces(country);

    return places.map(place => ({
      id: place.id,
      name: place.name,
      address: place.address,
      rating: place.rating,
      opening_hours: place.opening_hours,
      user_rating_total: place.user_rating_total,
      types: place.types,
      photos: place.photos.map(photo => ({
        url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${photo.width}&photoreference=${photo.photo_reference}&key=${this.apiKey}`,
        width: photo.width,
        height: photo.height,
      })),
    }))
  }

  @Get('detail')
  async getPlaceDetail(@Query('placeId') placeId: string) {
    let detail = await this.googleMapsService.getPlaceDetails(placeId);
    return {...detail, photos: detail.photos.map((photo) => ({
      url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${photo.width}&photo_reference=${photo.photo_reference}&key=${this.apiKey}`,
      width: photo.width,
      height: photo.height,
    })
    )};
  }
}
