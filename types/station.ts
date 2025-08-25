export type VehicleCategory =
  | '2W'
  | '3W'
  | 'Car'
  | 'SUV'
  | 'Truck'
  | 'Bus';

export interface Station {
  id: string;
  name: string;
  distance: string;
  rating: number;
  available: number;
  total: number;
  type: string;
  price: number;
  address: string;
  onDemand: boolean;
  city?: string;
  supportedVehicles?: VehicleCategory[];
  markerX?: number;
  markerY?: number;
  lat?: number;
  lng?: number;
}
