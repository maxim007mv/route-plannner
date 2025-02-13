import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <div class="content">
        <h1 class="title">Планировщик маршрутов</h1>
        <p class="subtitle">Создайте свой идеальный маршрут для прогулки по Москве</p>
        <button class="start-button" (click)="startPlanning()">Начать планирование</button>
      </div>

      <div class="features">
        <div class="feature-card">
          <span class="icon">🎯</span>
          <h3>Персонализация</h3>
          <p>Маршруты под ваши интересы</p>
        </div>
        <div class="feature-card">
          <span class="icon">🗺️</span>
          <h3>Удобная навигация</h3>
          <p>Интеграция с Яндекс.Картами</p>
        </div>
        <div class="feature-card">
          <span class="icon">⭐</span>
          <h3>Лучшие места</h3>
          <p>Популярные достопримечательности</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4rem;
      text-align: center;
    }

    .content {
      max-width: 800px;
      animation: fadeIn 1s ease-out;
    }

    .title {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: 1.25rem;
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }

    .start-button {
      padding: 1rem 2rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: white;
      background: var(--gradient-primary);
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
      }
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      width: 100%;
      max-width: 1200px;
    }

    .feature-card {
      padding: 2rem;
      background: var(--glass-background);
      border-radius: var(--radius-lg);
      border: 1px solid var(--glass-border);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }

      .icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        display: block;
      }

      h3 {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
      }

      p {
        color: var(--text-secondary);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .title {
        font-size: 2.5rem;
      }

      .features {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent {
  constructor(private router: Router) {}

  startPlanning() {
    console.log('Navigating to route page...');
    this.router.navigate(['/route']).then(
      (success) => console.log('Navigation success:', success),
      (error) => console.error('Navigation error:', error)
    );
  }
}
