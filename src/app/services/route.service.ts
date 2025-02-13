import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouteData } from '../models/route-data';
import { environment } from '../../environments/environment';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor(private http: HttpClient) {}

  private async retryRequest(fn: () => Promise<any>, retries = 5, delay = 2000): Promise<any> {
    try {
      return await fn();
    } catch (error: any) {
      if (retries > 0) {
        const nextDelay = delay * 1.5;
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(fn, retries - 1, nextDelay);
      }

      if (error.status === 503) {
        throw new Error('Сервис временно недоступен. Пожалуйста, попробуйте через несколько минут.');
      }
      throw new Error(error.message || 'Произошла ошибка при генерации маршрута');
    }
  }

  async generateRoute(formData: any): Promise<RouteData> {
    try {
      const prompt = this.createRoutePrompt(formData);
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Cache-Control', 'no-cache');

      const params = { key: environment.geminiApiKey };

      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

      const response = await this.retryRequest(() =>
        firstValueFrom(
          this.http.post(this.apiUrl, {
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            }
          }, { headers, params }).pipe(
            catchError(error => {
              if (error.status === 503) {
                throw new Error('Сервис временно перегружен. Пожалуйста, подождите...');
              }
              throw error;
            })
          )
        )
      );

      return this.parseRouteResponse(response);
    } catch (error: any) {
      console.error('Error in generateRoute:', error);
      throw new Error(error.message || 'Произошла непредвиденная ошибка');
    }
  }

  private createRoutePrompt(formData: any): string {
    return `Создай последовательный пешеходный маршрут прогулки по Москве, где точки маршрута логически связаны и находятся рядом друг с другом. Учитывай следующие параметры:
Участники: ${formData.withWhom}
Начало: ${formData.startTime}
Длительность: ${formData.duration} часа
Интересы: ${formData.interests.join(', ')}
Бюджет на кафе: ${formData.cafeBudget}
Способ передвижения: ${formData.transportPreference}
Темп прогулки: ${formData.pace}
${formData.accessibility ? 'Требуется доступная среда' : ''}
${formData.avoidCrowds ? 'Избегать людных мест' : ''}
Дополнительные пожелания: ${formData.additionalWishes}

Важно: Строй маршрут так, чтобы места находились в пешей доступности друг от друга, и можно было комфортно успеть посетить все точки за указанное время.

Формат вывода для каждого этапа:
### Этап 1: [Название района или главной достопримечательности]
⌚ Время: [XX:XX-XX:XX]
🗺️ Маршрут:
• Начните с [место], адрес: [адрес]
• Пройдите [X] метров по [улица] до [следующая точка]
• [Следующие шаги маршрута...]
🚕 Транспорт: [как добраться до начальной точки]
👀 Достопримечательности:
- [Название]: [краткое описание и адрес]
🍴 Где поесть:
- [Название заведения]: [кухня], [ценовой диапазон], [адрес]
📌 Советы:
✓ [совет по маршруту]
✓ [совет по времени посещения]
📍 Координаты: [координаты начальной точки этапа]`;
  }

  private parseRouteResponse(response: any): RouteData {
    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Invalid API response');

    const stages = text.split('### Этап').filter(Boolean).map((stage: string) => {
      const timeMatch = stage.match(/⌚ Время: (.+)/);
      const titleMatch = stage.match(/\d+: (.+?)\n/);
      const coordsMatch = stage.match(/📍 Координаты: (.+)/);
      const routeMatch = stage.match(/🗺️ Маршрут:([^🚕]+)/s);
      const transportMatch = stage.match(/🚕 Транспорт: (.+)/);

      const activities = [
        ...(stage.match(/👀 Достопримечательности:([^🍴]+)/s)?.[1] || '')
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.trim()),
        ...(stage.match(/🍴 Где поесть:([^📌]+)/s)?.[1] || '')
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.trim())
      ];

      const tips = (stage.match(/📌 Советы:([^📍]+)/s)?.[1] || '')
        .split('\n')
        .filter(line => line.trim().startsWith('✓'))
        .map(line => line.trim());

      return {
        title: titleMatch?.[1].trim() || 'Без названия',
        time: timeMatch?.[1].trim() || '',
        description: routeMatch?.[1].trim() || '',
        transport: transportMatch?.[1].trim() || '',
        activities,
        tips,
        coordinates: this.parseCoordinates(coordsMatch?.[1] || '')
      };
    });

    return {
      stages: stages.map(({ coordinates, ...rest }: { coordinates: { lat: number, lng: number }, [key: string]: any }) => rest),
      coordinates: stages.map((stage: { coordinates: { lat: number, lng: number } }) => stage.coordinates),
      mapUrl: this.generateYandexMapsUrl(stages.map((stage: { coordinates: { lat: number, lng: number } }) => stage.coordinates))
    };
  }

  private parseCoordinates(coordString: string): { lat: number, lng: number } {
    const [lat, lng] = coordString.split(',').map(Number);
    if (isNaN(lat) || isNaN(lng)) {
      return { lat: 55.751244, lng: 37.618423 }; // Координаты центра Москвы по умолчанию
    }
    return { lat, lng };
  }

  private generateYandexMapsUrl(coordinates: Array<{lat: number, lng: number}>): string {
    if (!coordinates.length) return '';

    // Формируем строку с координатами для маршрута
    const points = coordinates
      .map(coord => `${coord.lat},${coord.lng}`)
      .join('~');

    // Добавляем параметры для пешеходного маршрута
    return `https://yandex.ru/maps/?rtext=${points}&rtt=pd&mode=routes&rtt=pd`;
  }
}
