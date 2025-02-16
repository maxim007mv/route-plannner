import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  styles: [`
    .login-container {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 10;
    }

    .login-btn {
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 2rem;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      color: white;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

      .btn-icon {
        font-size: 1.2rem;
      }

      &:hover {
        background: var(--primary);
        transform: translateY(-2px);
      }
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.4rem 1rem 0.4rem 0.4rem;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

      .avatar-img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgba(255, 255, 255, 0.5);
      }

      .user-name {
        font-size: 0.9rem;
        color: white;
        font-weight: 500;
      }

      &:hover {
        background: var(--primary);
        transform: translateY(-2px);
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  showBackButton = false;
  isAuthenticated = false;
  userAvatar = 'assets/default-avatar.png';
  showAuthModal = false;
  isLoginMode = true;
  authForm: FormGroup;
  currentUser: User | null = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private location: Location,
    private authService: AuthService
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  login(): void {
    console.log('Нажата кнопка входа');
    this.router.navigate(['/login']);
  }

  startPlanning(): void {
    console.log('Переход к форме создания маршрута');
    this.router.navigate(['/route-form'])
      .then(() => console.log('Успешная навигация к форме маршрута'))
      .catch(err => console.error('Ошибка навигации:', err));
  }

  goBack() {
    this.location.back();
  }

  openProfileMenu() {
    if (!this.isAuthenticated) {
      this.showAuthModal = true;
    } else {
      // Навигация в профиль
    }
  }

  closeAuthModal() {
    this.showAuthModal = false;
  }

  onSubmit() {
    if (this.authForm.valid) {
      // Здесь будет логика аутентификации
      console.log(this.authForm.value);
    }
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  navigateToHistoricalRoutes(): void {
    console.log('Переход к историческим категориям');
    this.router.navigate(['/historical-categories'])
      .then(() => console.log('Успешная навигация к категориям'))
      .catch(err => console.error('Ошибка навигации:', err));
  }
}
