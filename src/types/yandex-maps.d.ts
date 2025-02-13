declare namespace ymaps {
  function ready(callback: () => void): Promise<void>;

  class Map {
    constructor(element: string | HTMLElement, options: MapOptions);
    geoObjects: GeoObjects;
    setBounds(bounds: number[][], options?: SetBoundsOptions): Promise<void>;
    destroy(): void;
  }

  interface MapOptions {
    center: number[];
    zoom: number;
    controls?: string[];
  }

  interface SetBoundsOptions {
    checkZoomRange?: boolean;
    zoomMargin?: number;
  }

  interface GeoObjects {
    add(object: any): void;
    removeAll(): void;
  }

  namespace multiRouter {
    class MultiRoute {
      constructor(options: MultiRouteOptions);
      events: Events;
      getBounds(): number[][];
    }
  }

  interface MultiRouteOptions {
    referencePoints: number[][];
    params?: {
      routingMode?: string;
      boundsAutoApply?: boolean;
    };
  }

  interface Events {
    add(event: string, callback: () => void): void;
  }
}

interface Window {
  ymaps: typeof ymaps;
}
