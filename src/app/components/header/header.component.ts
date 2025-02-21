import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="main-header">
      <nav>
        <a routerLink="/" class="logo">Маршруты Москвы</a>

        <div class="nav-links">
          <a routerLink="/historical-categories">Маршруты</a>
          <a routerLink="/route-form">Создать маршрут</a>
        </div>

        <div class="auth-section">
          <ng-container *ngIf="authService.currentUser$ | async as user; else loginButton">
            <div class="user-info" routerLink="/profile">
              <img [src]="user.avatar || 'assets/default-avatar.png'"
                   [alt]="user.name"
                   class="avatar">
              <span class="username">{{user.nickname || user.name}}</span>
            </div>
          </ng-container>

          <ng-template #loginButton>
            <button class="login-btn" routerLink="/login">Войти</button>
          </ng-template>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .main-header {
      background: var(--glass-background);
      padding: 1rem 2rem;
      box-shadow: var(--glass-shadow);
    }

    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .logo {
      color: var(--text-primary);
      text-decoration: none;
      font-weight: bold;
    }

    .nav-links {
      display: flex;
      gap: 2rem;

      a {
        color: var(--text-primary);
        text-decoration: none;

        &:hover {
          color: var(--primary);
        }
      }
    }

    .auth-section {
      display: flex;
      align-items: center;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: var(--radius-md);
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .username {
      color: var(--text-primary);
    }

    .login-btn {
      padding: 0.5rem 1rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        opacity: 0.9;
      }
    }
  `]
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}
}
