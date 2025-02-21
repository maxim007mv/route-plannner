import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface KeyPoint {
  title: string;
  description: string;
  time: string;
  address?: string;
  note?: string;
}

interface Tip {
  icon: string;
  text: string;
  title?: string;
}

interface Route {
  title: string;
  district: string;
  startPoint: string;
  duration: string;
  keyPoints: KeyPoint[];
  cafes: any[];
  tips: Tip[];
  costs: any;
}

@Component({
  selector: 'app-historical-routes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <button class="back-button" (click)="goBack()">
        <i class="fas fa-chevron-left"></i>
        <span>На главную</span>
      </button>

      <div class="header-section">
        <div class="header-content">
          <h1>Исторические маршруты</h1>
          <p class="subtitle">Путешествие во времени по улицам Москвы</p>
          <div class="header-badges">
            <span class="badge">
              <i class="fas fa-route"></i> 5+ маршрутов
            </span>
            <span class="badge">
              <i class="fas fa-clock"></i> 4-6 часов
            </span>
            <span class="badge">
              <i class="fas fa-camera"></i> 50+ мест
            </span>
          </div>
        </div>
      </div>

      <div class="routes-navigation">
        <button
          class="route-nav-btn"
          [class.active]="selectedRoute === 'popular'"
          (click)="selectRoute('popular')">
          <i class="fas fa-star"></i>
          <span>Кремль и Красная площадь</span>
        </button>
        <button
          class="route-nav-btn"
          [class.active]="selectedRoute === 'arbat'"
          (click)="selectRoute('arbat')">
          <i class="fas fa-landmark"></i>
          <span>Арбат и окрестности</span>
        </button>
        <button
          class="route-nav-btn"
          [class.active]="selectedRoute === 'zamoskvorechye'"
          (click)="selectRoute('zamoskvorechye')">
          <i class="fas fa-church"></i>
          <span>Замоскворечье: купеческая Москва</span>
        </button>
        <button
          class="route-nav-btn"
          [class.active]="selectedRoute === 'patriarshie'"
          (click)="selectRoute('patriarshie')">
          <i class="fas fa-book"></i>
          <span>Патриаршие пруды: литературная Москва</span>
        </button>
      </div>

      <div class="routes-container" [ngSwitch]="selectedRoute">
        <div class="route-card featured" *ngSwitchCase="'popular'">
          <div class="card-header">
            <div class="title-section">
              <div class="title-main">
                <span class="route-tag">
                  <i class="fas fa-star"></i> Популярный
                </span>
                <h2>Кремль и Красная площадь: сердце истории</h2>
              </div>
              <span class="district-badge">
                <i class="fas fa-map-marker-alt"></i>
                Центральный административный округ
              </span>
            </div>

            <div class="meta-info">
              <span class="meta-item">
                <i class="fas fa-clock"></i>
                5-6 часов
              </span>
              <span class="meta-item">
                <i class="fas fa-shoe-prints"></i>
                Легкий уровень
              </span>
              <span class="meta-item">
                <i class="fas fa-camera"></i>
                10+ фотозон
              </span>
            </div>
          </div>

          <div class="start-point">
            <div class="icon-wrapper">
              <i class="fas fa-train-subway"></i>
            </div>
            <div class="start-info">
              <span class="label">Начало маршрута</span>
              <p>Метро «Охотный Ряд» (выход к Манежной площади)</p>
              <div class="transport-options">
                <span class="transport-badge">
                  <i class="fas fa-bus"></i> Автобус №М2
                </span>
                <span class="transport-badge">
                  <i class="fas fa-train"></i> Метро
                </span>
              </div>
            </div>
          </div>

          <div class="route-timeline">
            <h3 class="section-title">
              <i class="fas fa-map-signs"></i>
              Маршрут
            </h3>

            <div class="timeline">
              <div class="timeline-item">
                <div class="time-marker">1</div>
                <div class="content">
                  <div class="location-header">
                    <h4>Манежная площадь</h4>
                    <span class="duration-badge">
                      <i class="fas fa-clock"></i>
                      30-40 минут
                    </span>
                  </div>
                  <div class="attractions-list">
                    <div class="attraction">
                      <i class="fas fa-fountain"></i>
                      <span>Фонтан «Часы мира»</span>
                    </div>
                    <div class="attraction">
                      <i class="fas fa-monument"></i>
                      <span>Скульптурная группа «Времена года»</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="timeline-item highlight">
                <div class="time-marker">2</div>
                <div class="content">
                  <div class="location-header">
                    <h4>Красная площадь</h4>
                    <span class="duration-badge">
                      <i class="fas fa-clock"></i>
                      1.5-2 часа
                    </span>
                  </div>

                  <div class="attractions-list">
                    <div class="attraction-card">
                      <i class="fas fa-church"></i>
                      <div class="attraction-info">
                        <h5>Храм Василия Блаженного</h5>
                        <p>Главный символ России, памятник XVI века</p>
                      </div>
                    </div>

                    <div class="attraction-card">
                      <i class="fas fa-landmark"></i>
                      <div class="attraction-info">
                        <h5>Лобное место</h5>
                        <p>Исторический памятник, место важных объявлений</p>
                      </div>
                    </div>

                    <div class="attraction-card">
                      <i class="fas fa-building-columns"></i>
                      <div class="attraction-info">
                        <h5>Мавзолей Ленина</h5>
                        <p>Памятник советской эпохи</p>
                      </div>
                    </div>

                    <div class="attraction-card">
                      <i class="fas fa-store"></i>
                      <div class="attraction-info">
                        <h5>ГУМ</h5>
                        <p>Главный универсальный магазин</p>
                      </div>
                    </div>
                  </div>

                  <div class="special-note">
                    <i class="fas fa-lightbulb"></i>
                    <div class="note-content">
                      <h5>Не пропустите!</h5>
                      <p>Посетите «Гастроном №1» в ГУМе с аутентичным советским интерьером</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Остальные точки маршрута -->
            </div>
          </div>

          <div class="food-section">
            <h3><i class="fas fa-utensils"></i> Где поесть</h3>
            <div class="cafe-grid">
              <div class="cafe-card">
                <div class="cafe-header">
                  <h4>Столовая №57</h4>
                  <div class="cafe-tags">
                    <span class="tag">Советская кухня</span>
                    <span class="tag">В ГУМе</span>
                  </div>
                </div>
                <div class="cafe-content">
                  <p class="specialties">
                    <i class="fas fa-award"></i>
                    Борщ, котлеты по-киевски
                  </p>
                  <p class="price-range">
                    <i class="fas fa-wallet"></i>
                    300–600 ₽
                  </p>
                </div>
              </div>
              <!-- Остальные кафе -->
            </div>
          </div>

          <div class="tips-section">
            <h3><i class="fas fa-lightbulb"></i> Советы</h3>
            <div class="tips-grid">
              <div class="tip-card">
                <div class="tip-icon">
                  <i class="fas fa-ticket-alt"></i>
                </div>
                <div class="tip-content">
                  <h4>Билеты в Кремль</h4>
                  <p>Купите единый билет онлайн (1000–1500 ₽) для избежания очередей</p>
                </div>
              </div>
              <div class="tip-card">
                <div class="tip-icon">
                  <i class="fas fa-bus"></i>
                </div>
                <div class="tip-content">
                  <h4>Альтернативный транспорт</h4>
                  <p>Автобус №М2 до остановки «Красная площадь»</p>
                </div>
              </div>
            </div>
          </div>

          <div class="cost-summary">
            <h3><i class="fas fa-coins"></i> Бюджет</h3>
            <div class="cost-grid">
              <div class="cost-item">
                <span class="cost-label">Входные билеты</span>
                <span class="cost-value">1000-1500 ₽</span>
              </div>
              <div class="cost-item">
                <span class="cost-label">Обед</span>
                <span class="cost-value">500-1000 ₽</span>
              </div>
              <div class="cost-item total">
                <span class="cost-label">Общий бюджет</span>
                <span class="cost-value">1500-2500 ₽</span>
              </div>
            </div>
          </div>

          <button class="view-details-btn">
            <span>Открыть подробный маршрут</span>
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>

        <div class="route-card" *ngSwitchCase="'arbat'">
          <div class="title-section">
            <h2>Арбат и окрестности: богемный дух</h2>
            <div class="route-meta">
              <span class="route-tag">
                <i class="fas fa-map-marker-alt"></i>
                Район: Арбат
              </span>
              <span class="route-tag">
                <i class="fas fa-subway"></i>
                Старт: м. Арбатская
              </span>
              <span class="route-tag">
                <i class="fas fa-clock"></i>
                3–4 часа
              </span>
            </div>
          </div>

          <div class="route-timeline">
            <div class="timeline">
              <div class="timeline-item" *ngFor="let point of historicalRoutes[1].keyPoints">
                <div class="time-marker">{{point.time}}</div>
                <div class="content">
                  <div class="location-header">
                    <h4>{{point.title}}</h4>
                    <span class="duration-badge" *ngIf="point.time">
                      <i class="fas fa-clock"></i>
                      {{point.time}}
                    </span>
                  </div>
                  <p class="location-desc">{{point.description}}</p>
                  <p class="location-address" *ngIf="point.address">{{point.address}}</p>
                  <div class="special-note" *ngIf="point.note">
                    <i class="fas fa-info-circle"></i>
                    <div class="note-content">
                      <p>{{point.note}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="food-section">
            <h3 class="section-title">
              <i class="fas fa-utensils"></i>
              Где поесть
            </h3>
            <div class="cafe-grid">
              <div class="cafe-card" *ngFor="let cafe of historicalRoutes[1].cafes">
                <div class="cafe-icon">
                  <i class="fas fa-store"></i>
                </div>
                <div class="cafe-content">
                  <div class="cafe-header">
                    <h4>{{cafe.name}}</h4>
                    <div class="cafe-description">
                      <span class="tag" *ngFor="let feature of cafe.features">
                        <i [class]="feature.icon"></i>
                        {{feature.text}}
                      </span>
                    </div>
                    <span class="price-badge">
                      <i class="fas fa-ruble-sign"></i>
                      {{cafe.price}}
                    </span>
                  </div>
                  <p class="specialties">
                    <i class="fas fa-star"></i>
                    {{cafe.description}}
                  </p>
                  <p class="address">
                    <i class="fas fa-map-marker-alt"></i>
                    {{cafe.address}}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="tips-section">
            <h3 class="section-title">
              <i class="fas fa-lightbulb"></i>
              Советы
            </h3>
            <div class="tips-grid">
              <div class="tip-card" *ngFor="let tip of historicalRoutes[1].tips">
                <div class="tip-icon">
                  <i [class]="tip.icon"></i>
                </div>
                <div class="tip-content">
                  <h4>{{tip.text}}</h4>
                  <p>{{tip.text}}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="cost-summary">
            <h3 class="section-title">
              <i class="fas fa-coins"></i>
              Бюджет
            </h3>
            <div class="cost-grid">
              <div class="cost-item">
                <span class="cost-label">Входные билеты</span>
                <span class="cost-value">{{historicalRoutes[1].costs.entrance}}</span>
              </div>
              <div class="cost-item">
                <span class="cost-label">Музеи</span>
                <span class="cost-value">{{historicalRoutes[1].costs.museums}}</span>
              </div>
              <div class="cost-item total">
                <span class="cost-label">Общий бюджет</span>
                <span class="cost-value">{{historicalRoutes[1].costs.total}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="route-card featured" *ngSwitchCase="'zamoskvorechye'">
          <div class="card-header">
            <div class="title-section">
              <div class="title-main">
                <span class="route-tag">
                  <i class="fas fa-building"></i> Купеческий
                </span>
                <h2>Замоскворечье: купеческая Москва</h2>
              </div>
              <span class="district-badge">
                <i class="fas fa-map-marker-alt"></i>
                Район Замоскворечье
              </span>
            </div>

            <div class="meta-info">
              <span class="meta-item">
                <i class="fas fa-clock"></i>
                3-4 часа
              </span>
              <span class="meta-item">
                <i class="fas fa-shoe-prints"></i>
                Средний уровень
              </span>
              <span class="meta-item">
                <i class="fas fa-camera"></i>
                8+ фотозон
              </span>
            </div>
          </div>

          <div class="start-point">
            <div class="icon-wrapper">
              <i class="fas fa-train-subway"></i>
            </div>
            <div class="start-info">
              <span class="label">Начало маршрута</span>
              <p>Метро «Третьяковская»</p>
              <div class="transport-options">
                <span class="transport-badge">
                  <i class="fas fa-bus"></i> Трамвай №А
                </span>
                <span class="transport-badge">
                  <i class="fas fa-train"></i> Метро
                </span>
              </div>
            </div>
          </div>

          <div class="route-timeline">
            <h3 class="section-title">
              <i class="fas fa-map-signs"></i>
              Маршрут
            </h3>

            <div class="timeline">
              <div class="timeline-item">
                <div class="time-marker">1</div>
                <div class="content">
                  <div class="location-header">
                    <h4>Третьяковская галерея</h4>
                    <span class="duration-badge">
                      <i class="fas fa-clock"></i>
                      1.5 часа
                    </span>
                  </div>
                  <div class="attractions-list">
                    <div class="attraction">
                      <i class="fas fa-palette"></i>
                      <span>Иконы Андрея Рублева</span>
                    </div>
                    <div class="attraction">
                      <i class="fas fa-image"></i>
                      <span>«Девочка с персиками» Серова</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="timeline-item highlight">
                <div class="time-marker">2</div>
                <div class="content">
                  <div class="location-header">
                    <h4>Храм Климента Папы Римского</h4>
                    <span class="duration-badge">
                      <i class="fas fa-clock"></i>
                      30 минут
                    </span>
                  </div>
                  <div class="attractions-list">
                    <div class="attraction-card">
                      <i class="fas fa-church"></i>
                      <div class="attraction-info">
                        <h5>Барокко XVIII века</h5>
                        <p>Уникальные фрески и иконостас</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Остальные точки маршрута в том же стиле -->
            </div>
          </div>

          <div class="food-section">
            <h3><i class="fas fa-utensils"></i> Где поесть</h3>
            <div class="cafe-grid">
              <div class="cafe-card">
                <div class="cafe-header">
                  <h4>Трапезная ANTIПА</h4>
                  <div class="cafe-tags">
                    <span class="tag">При храме</span>
                    <span class="tag">Постное меню</span>
                  </div>
                </div>
                <div class="cafe-content">
                  <p class="specialties">
                    <i class="fas fa-award"></i>
                    Постные блюда и выпечка
                  </p>
                  <p class="price-range">
                    <i class="fas fa-wallet"></i>
                    250–500 ₽
                  </p>
                </div>
              </div>
              <!-- Остальные кафе -->
            </div>
          </div>

          <div class="tips-section">
            <h3><i class="fas fa-lightbulb"></i> Советы</h3>
            <div class="tips-grid">
              <div class="tip-card">
                <div class="tip-icon">
                  <i class="fas fa-moon"></i>
                </div>
                <div class="tip-content">
                  <h4>Вечерняя прогулка</h4>
                  <p>Вечерняя подсветка храмов добавляет атмосферности</p>
                </div>
              </div>
              <div class="tip-card">
                <div class="tip-icon">
                  <i class="fas fa-train"></i>
                </div>
                <div class="tip-content">
                  <h4>Альтернативный транспорт</h4>
                  <p>Трамвай №А до остановки «Новокузнецкая»</p>
                </div>
              </div>
            </div>
          </div>

          <div class="cost-summary">
            <h3><i class="fas fa-coins"></i> Бюджет</h3>
            <div class="cost-grid">
              <div class="cost-item">
                <span class="cost-label">Входные билеты</span>
                <span class="cost-value">500-1000 ₽</span>
              </div>
              <div class="cost-item">
                <span class="cost-label">Обед</span>
                <span class="cost-value">400-800 ₽</span>
              </div>
              <div class="cost-item total">
                <span class="cost-label">Общий бюджет</span>
                <span class="cost-value">1500-2500 ₽</span>
              </div>
            </div>
          </div>

          <button class="view-details-btn">
            <span>Открыть подробный маршрут</span>
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>

        <div class="route-card featured" *ngSwitchCase="'patriarshie'">
          <div class="card-header">
            <div class="title-section">
              <div class="title-main">
                <span class="route-tag">
                  <i class="fas fa-book"></i> Литературный
                </span>
                <h2>Патриаршие пруды и Бульварное кольцо</h2>
              </div>
              <span class="district-badge">
                <i class="fas fa-map-marker-alt"></i>
                Пресненский район
              </span>
            </div>

            <div class="meta-info">
              <span class="meta-item">
                <i class="fas fa-clock"></i>
                3-4 часа
              </span>
              <span class="meta-item">
                <i class="fas fa-shoe-prints"></i>
                Легкий уровень
              </span>
              <span class="meta-item">
                <i class="fas fa-camera"></i>
                7+ фотозон
              </span>
            </div>
          </div>

          <div class="start-point">
            <div class="icon-wrapper">
              <i class="fas fa-train-subway"></i>
            </div>
            <div class="start-info">
              <span class="label">Начало маршрута</span>
              <p>Метро «Маяковская»</p>
              <div class="transport-options">
                <span class="transport-badge">
                  <i class="fas fa-bus"></i> Троллейбус №Б
                </span>
                <span class="transport-badge">
                  <i class="fas fa-train"></i> Метро
                </span>
              </div>
            </div>
          </div>

          <div class="route-timeline">
            <h3 class="section-title">
              <i class="fas fa-map-signs"></i>
              Маршрут
            </h3>

            <div class="timeline">
              <div class="timeline-item">
                <div class="time-marker">1</div>
                <div class="content">
                  <div class="location-header">
                    <h4>Патриаршие пруды</h4>
                    <span class="duration-badge">
                      <i class="fas fa-clock"></i>
                      40 минут
                    </span>
                  </div>
                  <div class="attractions-list">
                    <div class="attraction">
                      <i class="fas fa-book"></i>
                      <span>Место действия романа «Мастер и Маргарита»</span>
                    </div>
                    <div class="attraction">
                      <i class="fas fa-monument"></i>
                      <span>Памятник Крылову</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="timeline-item highlight">
                <div class="time-marker">2</div>
                <div class="content">
                  <div class="location-header">
                    <h4>Музей Булгакова</h4>
                    <span class="duration-badge">
                      <i class="fas fa-clock"></i>
                      1 час
                    </span>
                  </div>
                  <p class="location-address">Б. Садовая, 10</p>
                  <div class="attractions-list">
                    <div class="attraction-card">
                      <i class="fas fa-home"></i>
                      <div class="attraction-info">
                        <h5>«Нехорошая квартира» №50</h5>
                        <p>Музей-квартира М.А. Булгакова</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Остальные точки маршрута -->
            </div>
          </div>

          <div class="food-section">
            <h3><i class="fas fa-utensils"></i> Где поесть</h3>
            <div class="cafe-grid">
              <div class="cafe-card">
                <div class="cafe-header">
                  <h4>Кафе «Жан-Жак»</h4>
                  <div class="cafe-tags">
                    <span class="tag">Французская кухня</span>
                    <span class="tag">Исторический интерьер</span>
                  </div>
                </div>
                <div class="cafe-content">
                  <p class="specialties">
                    <i class="fas fa-award"></i>
                    Французская кухня в особняке XIX века
                  </p>
                  <p class="price-range">
                    <i class="fas fa-wallet"></i>
                    1200–2500 ₽
                  </p>
                </div>
              </div>
              <!-- Остальные кафе -->
            </div>
          </div>

          <div class="tips-section">
            <h3><i class="fas fa-lightbulb"></i> Советы</h3>
            <div class="tips-grid">
              <div class="tip-card">
                <div class="tip-icon">
                  <i class="fas fa-headphones"></i>
                </div>
                <div class="tip-content">
                  <h4>Аудиогид</h4>
                  <p>Возьмите аудиогид по булгаковским местам (доступен в музее)</p>
                </div>
              </div>
              <div class="tip-card">
                <div class="tip-icon">
                  <i class="fas fa-bus"></i>
                </div>
                <div class="tip-content">
                  <h4>Альтернативный транспорт</h4>
                  <p>Троллейбус №Б до остановки «Пушкинская площадь»</p>
                </div>
              </div>
            </div>
          </div>

          <div class="cost-summary">
            <h3><i class="fas fa-coins"></i> Бюджет</h3>
            <div class="cost-grid">
              <div class="cost-item">
                <span class="cost-label">Входные билеты</span>
                <span class="cost-value">300-500 ₽</span>
              </div>
              <div class="cost-item">
                <span class="cost-label">Музеи</span>
                <span class="cost-value">500-700 ₽</span>
              </div>
              <div class="cost-item total">
                <span class="cost-label">Общий бюджет</span>
                <span class="cost-value">2000-3500 ₽</span>
              </div>
            </div>
          </div>

          <button class="view-details-btn">
            <span>Открыть подробный маршрут</span>
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./historical-routes.component.scss']
})
export class HistoricalRoutesComponent {
  selectedRoute: string = 'popular';

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }

  selectRoute(route: string) {
    this.selectedRoute = route;
  }

  historicalRoutes: Route[] = [
    {
      title: 'Красная площадь и окрестности',
      district: 'Центральный административный округ',
      startPoint: 'Метро «Охотный Ряд» (выход к Манежной площади)',
      duration: '5-6 часов',
      keyPoints: [
        {
          title: 'Красная площадь',
          description: 'Мавзолей, ГУМ, Храм Василия Блаженного',
          time: '1 час'
        },
        {
          title: 'Кремль',
          description: 'Соборная площадь, Оружейная палата, Алмазный фонд',
          time: '2 часа'
        },
        {
          title: 'Парк «Зарядье»',
          description: '«Парящий мост», подземный музей',
          time: '1 час'
        }
      ] as KeyPoint[],
      cafes: [
        {
          name: 'ГУМ-гастроном',
          address: 'Красная площадь, 3',
          description: 'бутерброды, десерты',
          price: '500–800 ₽',
          features: [
            { icon: 'fas fa-wifi', text: 'Wi-Fi' },
            { icon: 'fas fa-credit-card', text: 'Оплата картой' }
          ]
        },
        {
          name: 'Шоколадница',
          address: 'Никольская ул., 10',
          description: 'кофе, завтраки',
          price: '300–500 ₽',
          features: [
            { icon: 'fas fa-wifi', text: 'Wi-Fi' },
            { icon: 'fas fa-credit-card', text: 'Оплата картой' }
          ]
        },
        {
          name: 'Советское ретро-кафе в «Зарядье»',
          address: 'ул. Варварка, 6',
          description: 'блюда советской кухни',
          price: '400–700 ₽',
          features: [
            { icon: 'fas fa-wifi', text: 'Wi-Fi' },
            { icon: 'fas fa-credit-card', text: 'Оплата картой' }
          ]
        }
      ],
      tips: [
        {
          icon: 'fas fa-clock',
          text: 'Закажите экскурсию в Дом Мельникова через сайт музея (от 1000 ₽)'
        },
        {
          icon: 'fas fa-music',
          text: 'Вечером на Арбате выступают уличные музыканты — идеальное время для прогулки'
        }
      ],
      costs: {
        entrance: '700–1000 ₽',
        museums: '300-500 ₽',
        food: '500-1000 ₽',
        total: '1500–2500 ₽'
      }
    },
    {
      title: 'Арбат и окрестности: богемный дух',
      district: 'Арбат',
      startPoint: 'Метро «Арбатская» (выход к Старому Арбату)',
      duration: '3–4 часа',
      keyPoints: [
        {
          title: 'Стена Виктора Цоя',
          description: 'культовое граффити поклонников рок-музыки',
          time: '30 минут'
        },
        {
          title: 'Музей-квартира Пушкина',
          description: 'экспозиция о жизни поэта и его эпохе',
          address: 'ул. Арбат, 53',
          time: '1 час'
        }
      ] as KeyPoint[],
      cafes: [
        {
          name: 'Кафе «Прага»',
          address: 'Арбат, 2/1',
          description: 'торты и горячие блюда в интерьере XIX века',
          price: '800–1500 ₽',
          features: [
            { icon: 'fas fa-utensils', text: 'Исторический интерьер' },
            { icon: 'fas fa-landmark', text: 'Исторический интерьер' }
          ]
        },
        {
          name: 'Ресторан She',
          address: 'Большая Никитская, 15',
          description: 'исторические блюда в здании Лавки имажинистов',
          price: '1000–2000 ₽',
          features: [
            { icon: 'fas fa-history', text: 'Историческое здание' },
            { icon: 'fas fa-utensils', text: 'Авторская кухня' }
          ]
        },
        {
          name: 'Пекарня «Хлеб Насущный»',
          address: 'Ермолаевский пер.',
          description: 'сэндвичи и пироги',
          price: '300–600 ₽',
          features: [
            { icon: 'fas fa-bread-slice', text: 'Свежая выпечка' },
            { icon: 'fas fa-coffee', text: 'Кофе' }
          ]
        }
      ],
      tips: [
        {
          icon: 'fas fa-ticket-alt',
          title: 'Дом Мельникова',
          text: 'Закажите экскурсию через сайт музея (от 1000 ₽)'
        },
        {
          icon: 'fas fa-bus',
          title: 'Альтернативный транспорт',
          text: 'Троллейбус №15 до остановки «Арбат»'
        }
      ],
      costs: {
        entrance: '1000 ₽ (экскурсия в Дом Мельникова)',
        museums: '500-1000 ₽ (другие музеи)',
        total: '2500-4500 ₽ (с обедом)'
      }
    },
    {
      title: 'Замоскворечье: купеческая Москва',
      district: 'Замоскворечье',
      startPoint: 'Метро «Третьяковская»',
      duration: '3–4 часа',
      keyPoints: [
        {
          title: 'Третьяковская галерея',
          description: 'иконы Рублева, «Девочка с персиками» Серова',
          address: 'Лаврушинский пер.',
          time: '1.5 часа'
        },
        {
          title: 'Храм Климента Папы Римского',
          description: 'барокко XVIII века, фрески и иконостас',
          address: 'Пятницкая ул.',
          time: '30 минут'
        },
        {
          title: 'Усадьба Демидовых',
          description: 'классицизм с элементами модерна',
          address: 'Б. Толмачевский пер.',
          time: '40 минут'
        },
        {
          title: 'Пятницкая улица',
          description: 'особняки купцов: дом Куманина, усадьба Игумнова',
          time: '45 минут'
        },
        {
          title: 'Овчинниковская набережная',
          description: 'панорама Москвы-реки и сталинских высоток',
          time: '30 минут'
        }
      ] as KeyPoint[],
      cafes: [
        {
          name: 'Трапезная ANTIПА',
          address: 'Колымажный пер.',
          description: 'постные блюда и выпечка при храме',
          price: '250–500 ₽',
          features: [
            { icon: 'fas fa-cross', text: 'При храме' },
            { icon: 'fas fa-bread-slice', text: 'Домашняя выпечка' }
          ]
        },
        {
          name: 'Ресторан «Урюк»',
          address: 'Пятницкая ул.',
          description: 'узбекский плов и самса',
          price: '600–1200 ₽',
          features: [
            { icon: 'fas fa-utensils', text: 'Восточная кухня' },
            { icon: 'fas fa-wifi', text: 'Wi-Fi' }
          ]
        },
        {
          name: 'Кофейня «Март»',
          address: 'Пятницкая ул.',
          description: 'авторский кофе и завтраки',
          price: '400–800 ₽',
          features: [
            { icon: 'fas fa-coffee', text: 'Авторский кофе' },
            { icon: 'fas fa-sun', text: 'Завтраки весь день' }
          ]
        }
      ],
      tips: [
        {
          icon: 'fas fa-moon',
          text: 'Вечерняя подсветка храмов добавляет атмосферности'
        },
        {
          icon: 'fas fa-train',
          text: 'Альтернатива метро: трамвай №А до остановки «Новокузнецкая»'
        }
      ],
      costs: {
        entrance: '500-1000 ₽ (Третьяковская галерея)',
        museums: '300-500 ₽ (другие музеи)',
        total: '1500-2500 ₽ (с обедом)'
      }
    },
    {
      title: 'Патриаршие пруды и Бульварное кольцо',
      district: 'Пресненский район',
      startPoint: 'Метро «Маяковская»',
      duration: '3–4 часа',
      keyPoints: [
        {
          title: 'Патриаршие пруды',
          description: 'Место действия романа «Мастер и Маргарита»',
          time: '40 минут',
          note: 'Здесь начинается действие знаменитого романа Булгакова'
        },
        {
          title: 'Музей Булгакова',
          description: '«Нехорошая квартира» №50',
          address: 'Б. Садовая, 10',
          time: '1 час'
        },
        {
          title: 'Спиридоновка',
          description: 'Особняк Рябушинского в стиле модерн',
          time: '30 минут'
        },
        {
          title: 'Тверской бульвар',
          description: 'Памятники Пушкину и Есенину, театр МХАТ',
          time: '45 минут'
        },
        {
          title: 'Страстной бульвар',
          description: 'Дом-комод и памятник Высоцкому',
          time: '30 минут'
        }
      ] as KeyPoint[],
      cafes: [
        {
          name: 'Кафе «Жан-Жак»',
          address: 'Спиридоньевский пер.',
          description: 'Французская кухня в особняке XIX века',
          price: '1200–2500 ₽',
          features: [
            { icon: 'fas fa-wine-glass', text: 'Французская кухня' },
            { icon: 'fas fa-building', text: 'Исторический интерьер' }
          ]
        },
        {
          name: 'Кофемания',
          address: 'Малая Бронная',
          description: 'Завтраки и десерты',
          price: '500–900 ₽',
          features: [
            { icon: 'fas fa-coffee', text: 'Авторский кофе' },
            { icon: 'fas fa-croissant', text: 'Свежая выпечка' }
          ]
        },
        {
          name: 'Пироговая «Волконский»',
          address: 'Б. Никитская',
          description: 'Круассаны и супы',
          price: '400–800 ₽',
          features: [
            { icon: 'fas fa-bread-slice', text: 'Свежая выпечка' },
            { icon: 'fas fa-utensils', text: 'Домашние супы' }
          ]
        }
      ],
      tips: [
        {
          icon: 'fas fa-headphones',
          text: 'Возьмите аудиогид по булгаковским местам (доступен в музее)'
        },
        {
          icon: 'fas fa-bus',
          text: 'Альтернатива метро: троллейбус №Б до остановки «Пушкинская площадь»'
        }
      ],
      costs: {
        entrance: '300-500 ₽',
        museums: '500-700 ₽',
        total: '2000-3500 ₽'
      }
    }
  ];
}
