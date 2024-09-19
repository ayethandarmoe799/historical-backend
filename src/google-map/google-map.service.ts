import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Client } from '@googlemaps/google-maps-services-js';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GoogleMapsService {
  private client: Client;

  constructor(private configService: ConfigService) {
    this.client = new Client({});
  }

  async getLatLngByCountry(country: string) {
    // console.log('country>>>>>>', country);
    const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');

    try {
      const response = await this.client.geocode({
        params: {
          address: country,
          key: apiKey,
        },
        timeout: 3000,
      });

      if (response.data.results.length === 0) {
        throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
      }

      const location = response.data.results[0].geometry.location;
      return location; 
    } catch (error) {
      console.log("error>", error);
      throw new HttpException('Error fetching location', HttpStatus.BAD_REQUEST);
    }
  }

  async findHistoricalPlaces(country: string) {
    const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');

     // Get lat/lng for the country
    const location = await this.getLatLngByCountry(country);
    const { lat, lng } = location;

    try {
      const response = await this.client.placesNearby({
        params: {
          location: `${lat}, ${lng}`,
          radius: 500000, 
          type: 'tourist_attraction', 
          keyword: 'historical', 
          key: apiKey,
        },
        timeout: 1000,
      });

      return response.data.results.map(place => ({
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        rating: place.rating,
        opening_hours: place.opening_hours,
        user_rating_total: place.user_ratings_total,
        types: place.types,
        photos: place.photos ? place.photos.map(photo => ({
          photo_reference: photo.photo_reference,
          width: photo.width,
          height: photo.height
        })) : [],
      }));
    } catch (error) {
      throw new HttpException('Error fetching places', HttpStatus.BAD_REQUEST);
    }
  }

  async getPlaceDetails(placeId: string) {
    const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
    
    try {
      const response = await this.client.placeDetails({
        params: {
          place_id: placeId,
          key: apiKey,
          fields: ['name', 'formatted_address', 'formatted_phone_number', 'photos', 'rating', 'opening_hours', 'reviews', 'editorial_summary'],
        },
        timeout: 1000, // milliseconds
      });
  
      return response.data.result; // Detailed place information
    } catch (error) {
      throw new HttpException('Error fetching place details', HttpStatus.BAD_REQUEST);
    }
  }
}

