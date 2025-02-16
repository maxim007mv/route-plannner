import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface RoutePoint {
  title: string;
  description: string;
  time: string;
  address?: string;
  note?: string;
}

interface Tip {
  icon: string;
  title?: string;
  text: string;
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
        <!-- Добавьте другие маршруты по необходимости -->
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
                  <h4 *ngIf="tip.title">{{tip.title}}</h4>
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

  historicalRoutes = [
    {
      title: 'Красная площадь и окрестности',
      district: 'Центральный административный округ',
      startPoint: 'Метро «Охотный Ряд» (выход к Манежной площади)',
      keyPoints: [
        {
          title: 'Красная площадь',
          description: 'Мавзолей, ГУМ, Храм Василия Блаженного',
          time: '1 час',
          address: 'Красная площадь',
          note: 'Лучшее время для посещения - раннее утро'
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
      ],
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
          title: 'Время посещения',
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
        },
        {
          title: 'Театр им. Вахтангова',
          description: 'экскурсии по закулисью, архитектура сталинского ампира',
          time: '45 минут'
        },
        {
          title: 'Дом Мельникова',
          description: 'шедевр конструктивизма',
          address: 'Кривоарбатский пер.',
          note: 'требуется предварительная запись',
          time: '1 час'
        },
        {
          title: 'Спасо-Хаус',
          description: 'резиденция посла США в неоготическом стиле',
          address: 'Спасопесковский пер.',
          time: '30 минут'
        }
      ],
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
    }
  ];
}
