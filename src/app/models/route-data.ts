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
}
