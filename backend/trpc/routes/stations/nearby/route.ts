import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const nearbyStationsSchema = z.object({
  lat: z.number().optional(),
  lng: z.number().optional(),
  radius: z.number().optional().default(10),
});

export const nearbyStationsProcedure = publicProcedure
  .input(nearbyStationsSchema)
  .query(async ({ input }) => {
    // Mock Hyderabad stations data
    const stations = [
      {
        id: '1',
        name: 'Hitech City Super Charger',
        location: 'HITEC City, Madhapur',
        lat: 17.4485,
        lng: 78.3908,
        distance: '2.3 km',
        type: 'DC Fast',
        price: 15,
        available: 3,
        total: 6,
        rating: 4.8,
        onDemand: true,
        supportedVehicles: ['2W', '3W', 'Car', 'SUV'],
      },
      {
        id: '2',
        name: 'Gachibowli Financial District',
        location: 'Financial District, Gachibowli',
        lat: 17.4239,
        lng: 78.3480,
        distance: '3.1 km',
        type: 'AC Fast',
        price: 12,
        available: 2,
        total: 4,
        rating: 4.6,
        onDemand: false,
        supportedVehicles: ['Car', 'SUV'],
      },
      {
        id: '3',
        name: 'Banjara Hills Premium',
        location: 'Road No. 12, Banjara Hills',
        lat: 17.4126,
        lng: 78.4486,
        distance: '4.2 km',
        type: 'DC Fast',
        price: 18,
        available: 1,
        total: 3,
        rating: 4.9,
        onDemand: true,
        supportedVehicles: ['2W', 'Car', 'SUV', 'Bus'],
      },
      {
        id: '4',
        name: 'Charminar Heritage Hub',
        location: 'Charminar, Old City',
        lat: 17.3616,
        lng: 78.4747,
        distance: '8.5 km',
        type: 'AC Standard',
        price: 10,
        available: 4,
        total: 8,
        rating: 4.3,
        onDemand: false,
        supportedVehicles: ['2W', '3W', 'Car'],
      },
      {
        id: '5',
        name: 'Shamshabad RGIA Airport',
        location: 'Rajiv Gandhi International Airport',
        lat: 17.2403,
        lng: 78.4294,
        distance: '25.8 km',
        type: 'DC Ultra Fast',
        price: 22,
        available: 6,
        total: 12,
        rating: 4.7,
        onDemand: true,
        supportedVehicles: ['Car', 'SUV', 'Bus'],
      },
      {
        id: '6',
        name: 'Kondapur IT Hub',
        location: 'Kondapur, IT Corridor',
        lat: 17.4647,
        lng: 78.3639,
        distance: '1.8 km',
        type: 'DC Fast',
        price: 16,
        available: 0,
        total: 4,
        rating: 4.5,
        onDemand: true,
        supportedVehicles: ['2W', 'Car', 'SUV'],
      },
    ];
    
    return stations;
  });

export default nearbyStationsProcedure;