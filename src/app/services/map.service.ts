import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor() {}

  loadYandexMaps(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof ymaps !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }
}
