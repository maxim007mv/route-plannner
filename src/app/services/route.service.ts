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
  private currentRoute: RouteData | null = null;

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
      console.log('Отправляем запрос с промптом:', prompt);

      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Cache-Control', 'no-cache');

      const params = { key: environment.geminiApiKey };

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
              console.error('Ошибка API:', error);
              throw error;
            })
          )
        )
      );

      console.log('Получен ответ от API:', response);
      const parsedRoute = this.parseResponse(response);
      console.log('Обработанный маршрут:', parsedRoute);
      return parsedRoute;
    } catch (error: any) {
      console.error('Ошибка в generateRoute:', error);
      throw error;
    }
  }

  private createRoutePrompt(formData: any): string {
    return `Создай очень подробный пешеходный маршрут по Москве. Маршрут должен быть последовательным и логичным, с детальным описанием каждого этапа.

Параметры маршрута:
Участники: ${formData.withWhom}
Время начала: ${formData.startTime}
Длительность: ${formData.duration} часа
Интересы: ${formData.interests.join(', ')}
Бюджет на кафе: ${formData.cafeBudget}
Транспорт: ${formData.transportPreference}
Темп: ${formData.pace}
${formData.accessibility ? 'Нужна доступная среда' : ''}
${formData.avoidCrowds ? 'Избегать людных мест' : ''}
Пожелания: ${formData.additionalWishes}

Для каждого этапа маршрута предоставь следующую информацию:
### Этап 1: [Название локации или активности]
⌚ Время: [Точное время начала и продолжительность]
🗺️ Маршрут: [Максимально подробное описание маршрута с указанием улиц, поворотов, ориентиров]
🚕 Транспорт: [Подробные инструкции как добраться]
👀 Достопримечательности:
- [Название]: [2-3 предложения описания]
- [Название]: [2-3 предложения описания]
🍴 Где поесть:
- [Название заведения]: [кухня, средний чек, особенности]
- [Название заведения]: [кухня, средний чек, особенности]
📌 Советы:
✓ [Совет по времени посещения]
✓ [Совет по билетам/очередям]
✓ [Другие полезные советы]
📍 Координаты: [55.XXXXX, 37.XXXXX]

Важно:
1. Учитывай время суток и сезон
2. Рассчитывай время на переходы
3. Добавляй время на осмотр
4. Учитывай перерывы на отдых
5. Предлагай альтернативы
6. Указывай места для фото
7. Добавляй исторические факты`;
  }

  private parseResponse(response: any): RouteData {
    try {
      const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Неверный формат ответа от API');
      }

      const stages = this.parseStages(text);
      const coordinates = this.parseCoordinates(text);

      return {
        stages: stages,
        coordinates: coordinates,
        mapUrl: this.generateMapUrl(coordinates)
      };
    } catch (error) {
      console.error('Ошибка при разборе ответа:', error);
      throw error;
    }
  }

  private parseStages(text: string): any[] {
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
        coordinates: [this.parseCoordinates(coordsMatch?.[1] || '')[0]]
      };
    });

    interface StageWithCoords {
      coordinates: Array<{ lat: number; lng: number }>;
      title: string;
      time: string;
      description: string;
      transport: string;
      activities: string[];
      tips: string[];
    }

    return stages.map(({ coordinates, ...rest }: StageWithCoords) => rest);
  }

  private parseCoordinates(text: string): Array<{lat: number, lng: number}> {
    const coordsMatches = text.match(/📍 Координаты: ([0-9.,\s]+)/g) || [];
    return coordsMatches.map(match => {
      const [lat, lng] = match.split(':')[1].trim().split(',').map(Number);
      return isNaN(lat) || isNaN(lng)
        ? { lat: 55.751244, lng: 37.618423 }
        : { lat, lng };
    });
  }

  private generateMapUrl(coordinates: any[]): string {
    if (!coordinates.length) return '';
    const points = coordinates
      .map(coord => `${coord.lat},${coord.lng}`)
      .join('~');
    return `https://yandex.ru/maps/?rtext=${points}&rtt=pd&mode=routes&rtt=pd`;
  }

  setCurrentRoute(route: RouteData) {
    this.currentRoute = route;
  }

  getCurrentRoute(): RouteData | null {
    return this.currentRoute;
  }

  async improveRoute(currentRoute: RouteData, improvements: { remove: string; add: string }): Promise<RouteData> {
    const prompt = `Улучши существующий маршрут с учетом пожеланий:
    Убрать: ${improvements.remove}
    Добавить: ${improvements.add}

    Текущий маршрут:
    ${currentRoute.stages.map((stage, i) => `
      Этап ${i + 1}: ${stage.title}
      Время: ${stage.time}
      Описание: ${stage.description}
    `).join('\n')}`;

    // Используем тот же метод генерации, но с новым промптом
    return this.generateRoute({ ...currentRoute, improvements: prompt });
  }
}
