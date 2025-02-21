import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav>
      <!-- Другие элементы навигации -->

      <ng-container *ngIf="authService.currentUser$ | async as user; else loginButton">
        <div class="user-info">
          <img [src]="user.avatar || 'assets/default-avatar.png'"
               [alt]="user.name"
               class="avatar">
          <span>{{user.name}}</span>
          <button (click)="authService.logout()">Выйти</button>
        </div>
      </ng-container>

      <ng-template #loginButton>
        <button routerLink="/login">Войти</button>
      </ng-template>
    </nav>
  `,
  styles: [`
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
  `]
})
export class NavComponent {
  constructor(public authService: AuthService) {}
}
