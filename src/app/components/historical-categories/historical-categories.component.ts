import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historical-categories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="categories-container">
      <h1 class="title">Исторические маршруты</h1>
      <div class="categories-grid">
        <div class="category-card active" (click)="navigateToHistoricalRoutes()">
          <div class="icon">🏛️</div>
          <h3>Исторические места</h3>
          <p>Знаковые места с богатой историей</p>
        </div>

        <div class="category-card disabled">
          <div class="icon">🗽</div>
          <h3>Памятники</h3>
          <p>Скульптуры и мемориальные комплексы</p>
          <div class="coming-soon">Скоро</div>
        </div>

        <div class="category-card disabled">
          <div class="icon">🏰</div>
          <h3>Архитектурные маршруты</h3>
          <p>Исторические здания и архитектурные ансамбли</p>
          <div class="coming-soon">Скоро</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .categories-container {
      min-height: 100vh;
      padding: 2rem;
      background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
      color: white;
    }

    .title {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      font-weight: 700;
      color: #ffffff;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .category-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border-radius: 1rem;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);

      &.active {
        cursor: pointer;
        &:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      }

      &.disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        font-weight: 600;
        color: #ffffff;
      }

      p {
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.5;
      }

      .coming-soon {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(255, 255, 255, 0.1);
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    @media (max-width: 768px) {
      .categories-grid {
        grid-template-columns: 1fr;
        padding: 1rem;
      }

      .title {
        font-size: 2rem;
      }
    }
  `]
})
export class HistoricalCategoriesComponent {
  constructor(private router: Router) {}

  navigateToHistoricalRoutes(): void {
    console.log('Переход к историческим маршрутам');
    this.router.navigate(['/historical-routes'])
      .then(() => console.log('Успешная навигация к историческим маршрутам'))
      .catch(err => console.error('Ошибка навигации:', err));
  }
}
