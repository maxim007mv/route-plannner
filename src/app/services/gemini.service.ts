import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormData } from '../models/route-data';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private readonly API_KEY = 'AIzaSyDb7rOQBhxw3xjOQOk2sGQhpX0lA2XQ_QI';
  private readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  constructor(private http: HttpClient) {}

  generateRoute(formData: FormData): Observable<any> {
    const prompt = this.createRoutePrompt(formData);

    return this.http.post(`${this.API_URL}?key=${this.API_KEY}`, {
      contents: [{ parts: [{ text: prompt }] }]
    }).pipe(
      map((response: any) => response.candidates[0].content.parts[0].text)
    );
  }

  private createRoutePrompt(formData: FormData): string {
    return `Создай детальный маршрут прогулки в Москве со следующими параметрами:
Участники: ${formData.withWhom}
Начало: ${formData.startTime}
Бюджет: ${formData.cafeBudget}
Пожелания: ${formData.wishes}

Формат вывода:
### Этап 1: [Название]
⌚ Время: [XX:XX-XX:XX]
🗺️ Маршрут:
• Начните с [место], идите по [улица]
• Поверните направо у [ориентир]
• Пройдите [метров] метров до [место]
🚕 Транспорт: [варианты]
👀 Достопримечательности:
- [Название]: [описание]
🍴 Где поесть:
- [Название]: [кухня], [цена]
📌 Советы:
✓ [совет 1]
✓ [совет 2]
📍 Координаты: 55.XXXX,37.XXXX`;
  }
}
