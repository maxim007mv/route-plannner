import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'user';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const userStr = localStorage.getItem(this.STORAGE_KEY);
    if (userStr) {
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
    }
  }

  register(email: string, password: string) {
    // В реальном приложении здесь был бы запрос к API
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      createdAt: new Date(),
      savedRoutes: []
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newUser));
    this.currentUserSubject.next(newUser);
    return Promise.resolve(newUser);
  }

  login(email: string, password: string) {
    // Проверяем, есть ли сохраненный пользователь
    const userStr = localStorage.getItem(this.STORAGE_KEY);
    if (userStr) {
      // Если есть сохраненный пользователь, используем его
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
      return Promise.resolve(user);
    } else {
      // Если нет сохраненного пользователя, создаем нового
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        createdAt: new Date(),
        savedRoutes: []
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newUser));
      this.currentUserSubject.next(newUser);
      return Promise.resolve(newUser);
    }
  }

  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  updateProfile(profileData: Partial<User>) {
    const userStr = localStorage.getItem(this.STORAGE_KEY);
    if (userStr) {
      const user = JSON.parse(userStr);
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
      return Promise.resolve(updatedUser);
    }
    return Promise.reject(new Error('Пользователь не найден'));
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
