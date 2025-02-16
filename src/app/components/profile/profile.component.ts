import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, EditProfileComponent],
  template: `
    <div class="profile-container" *ngIf="user">
      <button class="back-home-btn" (click)="goHome()">
        <span class="icon">🏠</span> На главную
      </button>

      <div class="profile-header">
        <div class="avatar-section">
          <img [src]="user.avatar || 'assets/default-avatar.png'" alt="Аватар" class="avatar">
          <div class="user-info">
            <h1>{{ user.nickname || 'Пользователь' }}</h1>
            <p class="email">{{ user.email }}</p>
            <p class="description">{{ user.description || 'Расскажите о себе' }}</p>
            <button class="edit-btn" (click)="showEditProfile()">
              <span class="icon">✏️</span> Редактировать профиль
            </button>
          </div>
        </div>
      </div>

      <div class="profile-content">
        <section class="saved-routes">
          <h2>Сохраненные маршруты</h2>
          <div class="routes-grid" *ngIf="user.savedRoutes?.length; else noRoutes">
            <div class="route-card" *ngFor="let route of user.savedRoutes">
              <div class="route-header">
                <h3>{{ route.title }}</h3>
                <div class="route-actions">
                  <button class="view-btn" (click)="viewRoute(route)">
                    <span class="icon">👁️</span>
                  </button>
                  <button class="delete-btn" (click)="deleteRoute(route)">
                    <span class="icon">🗑️</span>
                  </button>
                </div>
              </div>
              <p>{{ route.description }}</p>
            </div>
          </div>
          <ng-template #noRoutes>
            <div class="no-routes">
              <p>У вас пока нет сохраненных маршрутов</p>
              <button class="create-route-btn" (click)="createNewRoute()">Создать маршрут</button>
            </div>
          </ng-template>
        </section>
      </div>

      <div class="route-actions" *ngIf="currentRoute">
        <button class="save-route-btn" (click)="saveCurrentRoute()">
          <span class="icon">💾</span> Сохранить маршрут
        </button>
        <button class="new-route-btn" (click)="createNewRoute()">
          <span class="icon">🗺️</span> Создать новый маршрут
        </button>
      </div>

      <button class="logout-btn" (click)="logout()">
        <span class="icon">🚪</span> Выйти
      </button>
    </div>

    <app-edit-profile *ngIf="showEditModal" (close)="hideEditProfile()"></app-edit-profile>
  `,
  styles: [`
    .profile-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      min-height: 100vh;
      background: var(--bg-secondary);
    }

    .profile-header {
      background: var(--glass-background);
      border-radius: var(--radius-lg);
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: var(--glass-shadow);

      .avatar-section {
        display: flex;
        gap: 2rem;
        align-items: center;

        @media (max-width: 768px) {
          flex-direction: column;
          text-align: center;
        }
      }

      .avatar {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid var(--primary);
      }

      .user-info {
        flex: 1;

        h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .email {
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .description {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }
      }
    }

    .edit-btn {
      padding: 0.75rem 1.5rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      &:hover {
        opacity: 0.9;
        transform: translateY(-2px);
      }
    }

    .routes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .route-card {
      background: var(--glass-background);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: var(--glass-shadow);
      }

      .route-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h3 {
          margin: 0;
          color: var(--text-primary);
        }
      }

      .route-actions {
        display: flex;
        gap: 0.5rem;

        button {
          padding: 0.5rem;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.3s ease;

          &.view-btn {
            background: var(--primary);
            color: white;
          }

          &.delete-btn {
            background: var(--danger);
            color: white;
          }

          &:hover {
            opacity: 0.9;
          }
        }
      }
    }

    .no-routes {
      text-align: center;
      padding: 3rem;
      background: var(--glass-background);
      border-radius: var(--radius-lg);

      p {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
      }

      .create-route-btn {
        padding: 0.75rem 1.5rem;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }
      }
    }

    .logout-btn {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      padding: 0.75rem 1.5rem;
      background: var(--danger);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      &:hover {
        opacity: 0.9;
        transform: translateY(-2px);
      }
    }

    .back-home-btn {
      position: absolute;
      top: 2rem;
      left: 2rem;
      padding: 0.75rem 1.5rem;
      background: var(--glass-background);
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-primary);
      font-weight: 500;

      &:hover {
        transform: translateY(-2px);
        background: var(--primary);
        color: white;
      }
    }

    .route-actions {
      display: flex;
      gap: 1rem;
      margin: 2rem 0;
      justify-content: center;

      button {
        padding: 1rem 2rem;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;

        &.save-route-btn {
          background: var(--success);
          color: white;
        }

        &.new-route-btn {
          background: var(--primary);
          color: white;
        }

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  showEditModal = false;
  currentRoute: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.user = user;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  viewRoute(route: any) {
    console.log('Просмотр маршрута:', route);
  }

  deleteRoute(route: any) {
    console.log('Удаление маршрута:', route);
  }

  showEditProfile() {
    this.showEditModal = true;
  }

  hideEditProfile() {
    this.showEditModal = false;
  }

  createNewRoute() {
    this.router.navigate(['/route']);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  saveCurrentRoute() {
    if (this.currentRoute) {
      const updatedRoutes = [...(this.user?.savedRoutes || []), this.currentRoute];
      this.authService.updateProfile({ savedRoutes: updatedRoutes });
      this.currentRoute = null;
    }
  }
}
