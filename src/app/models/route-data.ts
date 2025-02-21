export interface RouteData {
  stages: Array<{
    title: string;
    time: string;
    description: string;
    transport: string;
    activities: string[];
    tips: string[];
  }>;
  coordinates: Array<{
    lat: number;
    lng: number;
  }>;
  mapUrl: string;
  stats?: {
    totalDistance: number;
    totalTime: number;
    averageSpeed: number;
    segments: Array<{
      start: { lat: number; lng: number; };
      end: { lat: number; lng: number; };
      distance: number;
      time: number;
    }>;
  };
}

export interface PointOfInterest {
  name: string;
  description: string;
  type: 'museum' | 'church' | 'architecture' | 'viewpoint';
  visitTime: number; // в минутах
  price?: number;
  openHours?: string;
  photos?: string[];
}

export const zamoskvorechyePOIs: PointOfInterest[] = [
  {
    name: 'Третьяковская галерея',
    description: 'Главный музей русского искусства с богатейшей коллекцией картин и икон',
    type: 'museum',
    visitTime: 120,
    price: 500,
    openHours: '10:00-21:00',
    photos: ['tretyakov.jpg']
  },
  {
    name: 'Храм Климента Папы Римского',
    description: 'Великолепный образец московского барокко XVIII века',
    type: 'church',
    visitTime: 30,
    openHours: '8:00-20:00',
    photos: ['clement.jpg']
  },
  // ... другие достопримечательности
];
