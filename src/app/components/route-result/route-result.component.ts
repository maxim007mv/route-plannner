import { Component, Input, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteData } from '../../models/route-data';

@Component({
  selector: 'app-route-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './route-result.component.html',
  styleUrls: ['./route-result.component.scss']
})
export class RouteResultComponent implements AfterViewInit, OnDestroy {
  @Input() routeData!: RouteData;
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map: ymaps.Map | null = null;
  private mapInitialized = false;

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.destroy();
    }
  }

  private async initMap(): Promise<void> {
    if (this.mapInitialized) return;

    try {
      // Проверяем, не инициализирована ли уже карта
      if (this.map) {
        this.map.destroy();
        this.map = null;
      }

      await this.waitForYMaps();
      this.createMap();
      this.displayRouteOnMap();
      this.mapInitialized = true;
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  private waitForYMaps(): Promise<void> {
    return new Promise((resolve) => {
      // Если ymaps уже загружен
      if (typeof ymaps !== 'undefined' && ymaps.ready) {
        ymaps.ready(resolve);
        return;
      }

      // Если скрипт уже добавлен на страницу
      const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
      if (existingScript) {
        ymaps.ready(resolve);
        return;
      }

      // Если скрипт еще не добавлен
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      script.async = true;
      script.onload = () => ymaps.ready(resolve);
      document.head.appendChild(script);
    });
  }

  private createMap(): void {
    const defaultCenter = [55.76, 37.64]; // Москва
    this.map = new ymaps.Map(this.mapContainer.nativeElement, {
      center: defaultCenter,
      zoom: 10,
      controls: ['zoomControl', 'fullscreenControl']
    });
  }

  private displayRouteOnMap(): void {
    if (!this.map || !this.routeData.coordinates.length) return;

    this.map.geoObjects.removeAll();

    const points = this.routeData.coordinates.map(coord => [coord.lat, coord.lng]);

    const multiRoute = new ymaps.multiRouter.MultiRoute({
      referencePoints: points,
      params: {
        routingMode: 'pedestrian',
        boundsAutoApply: true
      }
    });

    this.map.geoObjects.add(multiRoute);

    multiRoute.events.add('routeready', () => {
      if (this.map) {
        this.map.setBounds(multiRoute.getBounds(), {
          checkZoomRange: true,
          zoomMargin: 30
        });
      }
    });
  }

  openInYandexMaps(stageIndex?: number): void {
    if (typeof stageIndex === 'number') {
      // Открываем конкретный этап
      const stage = this.routeData.stages[stageIndex];
      const coordinates = this.routeData.coordinates[stageIndex];
      if (coordinates) {
        window.open(`https://yandex.ru/maps/?pt=${coordinates.lat},${coordinates.lng}&z=15`, '_blank');
      }
    } else {
      // Открываем весь маршрут
      if (this.routeData.mapUrl) {
        window.open(this.routeData.mapUrl, '_blank');
      }
    }
  }
}
