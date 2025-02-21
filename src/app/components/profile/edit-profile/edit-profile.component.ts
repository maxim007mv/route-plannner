import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="edit-profile-modal">
      <div class="modal-content">
        <h2>Редактировать профиль</h2>
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
          <div class="avatar-section">
            <img [src]="currentAvatarUrl || 'assets/default-avatar.png'" alt="Аватар">
            <label class="upload-btn">
              Изменить фото
              <input type="file" accept="image/*" (change)="onFileSelected($event)">
            </label>
          </div>

          <div class="form-group">
            <label>Никнейм</label>
            <input type="text" formControlName="nickname" placeholder="Ваш никнейм">
          </div>

          <div class="form-group">
            <label>О себе</label>
            <textarea formControlName="description" placeholder="Расскажите о себе"></textarea>
          </div>

          <div class="buttons">
            <button type="submit" [disabled]="profileForm.invalid || isLoading">
              {{ isLoading ? 'Сохранение...' : 'Сохранить' }}
            </button>
            <button type="button" class="cancel" (click)="cancel()">Отмена</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .edit-profile-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: var(--bg-primary);
      padding: 2.5rem;
      border-radius: var(--radius-lg);
      width: 90%;
      max-width: 500px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

      h2 {
        color: var(--text-primary);
        font-size: 1.75rem;
        margin-bottom: 2rem;
        text-align: center;
      }
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.75rem;
        color: var(--text-primary);
        font-weight: 500;
        font-size: 1.1rem;
      }

      input, textarea {
        width: 100%;
        padding: 1rem;
        border: 2px solid var(--glass-border);
        border-radius: var(--radius-md);
        background: var(--glass-background);
        color: var(--text-primary);
        font-size: 1rem;

        &::placeholder {
          color: var(--text-secondary);
        }

        &:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.2);
        }
      }
    }

    .avatar-section {
      text-align: center;
      margin-bottom: 2rem;

      img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 1rem;
        border: 3px solid var(--primary);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }

      input[type="file"] {
        display: none;
      }

      .upload-btn {
        padding: 0.75rem 1.5rem;
        background: var(--glass-background);
        border: 2px solid var(--primary);
        color: var(--primary);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;

        &:hover {
          background: var(--primary);
          color: white;
        }
      }
    }

    .buttons {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;

      button {
        flex: 1;
        padding: 1rem;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
        font-size: 1rem;

        &[type="submit"] {
          background: var(--primary);
          color: white;

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(var(--primary-rgb), 0.3);
          }
        }

        &.cancel {
          background: var(--danger);
          color: white;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(var(--danger-rgb), 0.3);
          }
        }

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      }
    }
  `]
})
export class EditProfileComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  profileForm: FormGroup;
  isLoading = false;
  currentAvatarUrl: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      nickname: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.profileForm.patchValue({
        nickname: currentUser.nickname || '',
        description: currentUser.description || ''
      });
      this.currentAvatarUrl = currentUser.avatar ?? null;
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.currentAvatarUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    if (this.profileForm.invalid) return;

    this.isLoading = true;
    try {
      const formData = this.profileForm.value;
      if (this.selectedFile) {
        formData.avatar = await this.convertFileToBase64(this.selectedFile);
      }
      this.authService.updateUserData(formData);
      this.close.emit();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  cancel() {
    this.close.emit();
  }
}
