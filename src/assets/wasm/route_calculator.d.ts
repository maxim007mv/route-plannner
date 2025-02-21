export declare module "*.wasm" {
  const content: any;
  export default content;
}

export declare module "../../assets/wasm/route_calculator.js" {
  export function createModule(): Promise<{
    RouteCalculator: new () => RouteCalculator;
  }>;

  export class RouteCalculator {
    calculateDistance(p1: {lat: number, lng: number}, p2: {lat: number, lng: number}): number;
    optimizeRoute(points: Array<{lat: number, lng: number}>): Array<{lat: number, lng: number}>;
    calculateRouteStats(points: Array<{lat: number, lng: number}>): {
      totalDistance: number;
      totalTime: number;
      averageSpeed: number;
      segments: Array<{
        start: {lat: number, lng: number};
        end: {lat: number, lng: number};
        distance: number;
        time: number;
      }>;
    };
  }
}
