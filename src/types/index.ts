export type Operator = {
  id: string;
  name: string;
  logo?: string;
  serviceType: string;
};

export type Station = {
  id: string;
  code: string;
  name: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  type: string;
};

export type Train = {
  id: string;
  number: string;
  name: string;
  operatorId: string;
  serviceType: string;
  class?: string;
};

export type TripStop = {
  id: string;
  tripId: string;
  stationId: string;
  scheduledArrival: string; // ISO String
  estimatedArrival?: string;
  actualArrival?: string;
  scheduledDeparture: string;
  estimatedDeparture?: string;
  actualDeparture?: string;
  platform?: string;
  status: 'SCHEDULED' | 'BOARDING' | 'IN_TRANSIT' | 'ARRIVED' | 'DELAYED' | 'CANCELLED';
  delayMinutes: number;
};

export type Trip = {
  id: string;
  trainId: string;
  originId: string;
  destinationId: string;
  scheduledDeparture: string;
  estimatedDeparture?: string;
  actualDeparture?: string;
  scheduledArrival: string;
  estimatedArrival?: string;
  actualArrival?: string;
  currentStatus: 'SCHEDULED' | 'BOARDING' | 'IN_TRANSIT' | 'ARRIVED' | 'DELAYED' | 'CANCELLED';
  delayMinutes: number;
  currentLat?: number;
  currentLng?: number;
  currentSpeed?: number;
  heading?: number;
  positionSource: 'LIVE' | 'ESTIMATED' | 'SCHEDULED' | 'OFFLINE';
  lastUpdated: string;
  stops?: TripStop[]; // Embedded for API response
};

export type Disruption = {
  id: string;
  title: string;
  type: 'WEATHER' | 'TRACK' | 'SIGNAL' | 'TRAIN' | 'OTHER';
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location?: string;
  status: 'ACTIVE' | 'RESOLVED';
  description: string;
  startTime: string;
  endTime?: string;
  createdAt: string;
};
