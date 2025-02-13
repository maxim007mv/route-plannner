import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private static isApiLoaded = false;

  async loadApi(): Promise<void> {
    if (MapService.isApiLoaded) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      // Проверяем, не загружается ли скрипт уже
      if (document.querySelector('script[src*="api-maps.yandex.ru"]')) {
        MapService.isApiLoaded = true;
        return resolve();
      }

      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU`;
      script.async = true;
      script.onload = () => {
        MapService.isApiLoaded = true;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}
