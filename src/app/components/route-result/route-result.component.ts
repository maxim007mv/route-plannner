import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouteData } from '../../models/route-data';
import { Router } from '@angular/router';
import { RouteService } from '../../services/route.service';

// Объявляем тип для ymaps
declare var ymaps: any;

@Component({
  selector: 'app-route-result',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './route-result.component.html',
  styleUrls: ['./route-result.component.scss']
})
export class RouteResultComponent implements AfterViewInit, OnDestroy {
  @Input() routeData: RouteData | null = null;
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map: ymaps.Map | null = null;
  private mapInitialized = false;

  showImproveModal = false;
  isImproving = false;
  improvementData = {
    remove: '',
    add: ''
  };

  isLoading = false;

  constructor(
    private router: Router,
    private routeService: RouteService
  ) {
    const currentRoute = this.routeService.getCurrentRoute();

    if (!currentRoute && !this.isLoading) {
      this.router.navigate(['/route-form']);
      return;
    }

    this.routeData = currentRoute;
  }

  ngAfterViewInit(): void {
    if (this.routeData && this.mapContainer) {
      this.initMap();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }
    this.mapInitialized = false;
  }

  private async initMap(): Promise<void> {
    if (this.mapInitialized) return;

    try {
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
      // Проверяем существование объекта ymaps и его готовность
      if (typeof ymaps !== 'undefined' && ymaps.ready) {
        ymaps.ready(resolve);
        return;
      }

      const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
      if (existingScript) {
        ymaps.ready(resolve);
        return;
      }

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
    if (!this.map || !this.routeData?.coordinates.length) return;

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
      const stage = this.routeData?.stages[stageIndex];
      const coordinates = this.routeData?.coordinates[stageIndex];
      if (coordinates) {
        window.open(`https://yandex.ru/maps/?pt=${coordinates.lat},${coordinates.lng}&z=15`, '_blank');
      }
    } else {
      if (this.routeData?.mapUrl) {
        window.open(this.routeData.mapUrl, '_blank');
      }
    }
  }

  createNewRoute() {
    this.router.navigate(['/route-form']);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  getTotalDuration(): string {
    return '~3 часа';
  }

  getEstimatedBudget(): string {
    return '2000-3000 ₽';
  }

  getTransportInfo(): string {
    return 'Пешком + метро';
  }

  getRouteTags(): string[] {
    return ['Исторические места', 'Музеи', 'Парки', 'Кафе'];
  }

  getTagIcon(tag: string): string {
    const icons: { [key: string]: string } = {
      'Исторические места': 'fas fa-landmark',
      'Музеи': 'fas fa-museum',
      'Парки': 'fas fa-tree',
      'Кафе': 'fas fa-coffee'
    };
    return icons[tag] || 'fas fa-tag';
  }

  openImproveModal() {
    this.showImproveModal = true;
  }

  closeImproveModal() {
    this.showImproveModal = false;
    this.improvementData = { remove: '', add: '' };
  }

  async improveRoute() {
    if (!this.improvementData.remove && !this.improvementData.add) return;

    this.isImproving = true;
    try {
      const improvedRoute = await this.routeService.improveRoute(
        this.routeData!,
        this.improvementData
      );
      this.routeData = improvedRoute;
      this.closeImproveModal();
    } catch (error) {
      console.error('Error improving route:', error);
    } finally {
      this.isImproving = false;
    }
  }

  showLoading() {
    this.isLoading = true;
  }

  setRouteData(data: RouteData) {
    this.isLoading = false;
    this.routeData = data;
  }
}
