import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>{{ isLoginMode ? 'Вход' : 'Регистрация' }}</h2>
          <div class="auth-toggle">
            <button
              [class.active]="isLoginMode"
              (click)="isLoginMode = true">Вход</button>
            <button
              [class.active]="!isLoginMode"
              (click)="isLoginMode = false">Регистрация</button>
          </div>
        </div>

        <form [formGroup]="authForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <input
              type="email"
              formControlName="email"
              placeholder="Email"
              [class.invalid]="isFieldInvalid('email')">
            <div class="error-message" *ngIf="isFieldInvalid('email')">
              Введите корректный email
            </div>
          </div>

          <div class="form-group">
            <input
              type="password"
              formControlName="password"
              placeholder="Пароль"
              [class.invalid]="isFieldInvalid('password')">
            <div class="error-message" *ngIf="isFieldInvalid('password')">
              Пароль должен быть не менее 6 символов
            </div>
          </div>

          <button type="submit" [disabled]="authForm.invalid || isLoading">
            {{ isLoading ? 'Загрузка...' : (isLoginMode ? 'Войти' : 'Зарегистрироваться') }}
          </button>
        </form>

        <button class="back-btn" (click)="goBack()">← Назад</button>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));
    }

    .auth-card {
      background: var(--glass-background);
      padding: 2rem;
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 400px;
      box-shadow: var(--glass-shadow);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;

      h2 {
        margin-bottom: 1rem;
      }
    }

    .auth-toggle {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;

      button {
        flex: 1;
        padding: 0.5rem;
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--text-secondary);
        transition: all 0.3s ease;

        &.active {
          color: var(--primary);
          border-bottom: 2px solid var(--primary);
        }
      }
    }

    .form-group {
      margin-bottom: 1rem;

      input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        background: transparent;
        transition: all 0.3s ease;

        &.invalid {
          border-color: var(--danger);
        }

        &:focus {
          outline: none;
          border-color: var(--primary);
        }
      }
    }

    .error-message {
      color: var(--danger);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    button[type="submit"] {
      width: 100%;
      padding: 0.75rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover:not(:disabled) {
        opacity: 0.9;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .back-btn {
      margin-top: 1rem;
      padding: 0.5rem;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        color: var(--primary);
      }
    }
  `]
})
export class LoginComponent {
  isLoginMode = true;
  isLoading = false;
  authForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.authForm.get(fieldName);
    return field ? (field.invalid && field.touched) : false;
  }

  async onSubmit() {
    if (this.authForm.invalid) return;

    this.isLoading = true;
    const { email, password } = this.authForm.value;

    try {
      console.log('Попытка', this.isLoginMode ? 'входа' : 'регистрации');
      if (this.isLoginMode) {
        await this.authService.login(email, password);
      } else {
        await this.authService.register(email, password);
      }
      console.log('Успешная аутентификация');
      this.router.navigate(['/profile']);
    } catch (error: any) {
      console.error('Ошибка аутентификации:', error);
      // Здесь можно добавить отображение ошибки пользователю
    } finally {
      this.isLoading = false;
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
