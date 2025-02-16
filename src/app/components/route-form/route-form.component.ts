import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouteService } from '../../services/route.service';
import { RouteData } from '../../models/route-data';

@Component({
  selector: 'app-route-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './route-form.component.html',
  styleUrls: ['./route-form.component.scss']
})
export class RouteFormComponent {
  routeForm: FormGroup;
  currentStep = 1;
  totalSteps = 6;
  isLoading = false;
  error: string | null = null;
  generatedRoute: RouteData | null = null;

  companions = [
    { value: 'Один', icon: '👤' },
    { value: 'С партнером', icon: '👫' },
    { value: 'С друзьями', icon: '👥' },
    { value: 'С семьей', icon: '👨‍👩‍👦' }
  ];

  interests = [
    { value: 'history', label: 'История', icon: '🏛️' },
    { value: 'art', label: 'Искусство', icon: '🎨' },
    { value: 'food', label: 'Гастрономия', icon: '🍽️' },
    { value: 'nature', label: 'Природа', icon: '🌳' },
    { value: 'architecture', label: 'Архитектура', icon: '🏰' },
    { value: 'shopping', label: 'Шоппинг', icon: '🛍️' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private routeService: RouteService
  ) {
    this.routeForm = this.fb.group({
      withWhom: ['', Validators.required],
      startTime: ['', Validators.required],
      duration: ['', Validators.required],
      interests: [[], Validators.required],
      cafeBudget: ['', Validators.required],
      transportPreference: ['', Validators.required],
      pace: ['', Validators.required],
      accessibility: [false],
      avoidCrowds: [false],
      additionalWishes: ['']
    });
  }

  nextStep() {
    if (this.isCurrentStepValid()) {
      this.currentStep++;
    }
  }

  previousStep() {
    this.currentStep--;
  }

  isCurrentStepValid(): boolean {
    const stepControls = {
      1: ['withWhom'],
      2: ['startTime', 'duration'],
      3: ['interests'],
      4: ['cafeBudget', 'transportPreference'],
      5: ['pace', 'accessibility', 'avoidCrowds'],
      6: ['additionalWishes']
    };

    return stepControls[this.currentStep as keyof typeof stepControls]
      .every(control => this.routeForm.get(control)?.valid);
  }

  selectCompanion(value: string) {
    this.routeForm.patchValue({ withWhom: value });
  }

  toggleInterest(interest: string) {
    const currentInterests = this.routeForm.get('interests')?.value || [];
    const index = currentInterests.indexOf(interest);

    if (index === -1) {
      currentInterests.push(interest);
    } else {
      currentInterests.splice(index, 1);
    }

    this.routeForm.patchValue({ interests: currentInterests });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.routeForm.get(fieldName);
    return field ? (field.invalid && field.touched) : false;
  }

  async onSubmit() {
    if (this.routeForm.invalid) {
      this.error = 'Пожалуйста, заполните все поля корректно';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.generatedRoute = null;

    try {
      console.log('Отправка формы:', this.routeForm.value);
      const result = await this.routeService.generateRoute(this.routeForm.value);
      console.log('Получен результат:', result);

      if (!result || !result.stages || result.stages.length === 0) {
        throw new Error('Получен пустой маршрут');
      }

      this.generatedRoute = result;
      this.routeService.setCurrentRoute(result);
      await this.router.navigate(['/route-result']);
    } catch (error: any) {
      console.error('Ошибка генерации маршрута:', error);
      this.error = error.message || 'Произошла ошибка при генерации маршрута';

      if (error.message.includes('временно')) {
        setTimeout(() => {
          this.error = null;
          this.onSubmit();
        }, 5000);
      }
    } finally {
      this.isLoading = false;
    }
  }

  resetForm() {
    this.generatedRoute = null;
    this.currentStep = 1;
    this.routeForm.reset();
  }

  goBack() {
    this.router.navigate(['/']);
  }

  getStepTitle(): string {
    const titles = {
      1: 'С кем планируете прогулку?',
      2: 'Когда и как долго?',
      3: 'Что вас интересует?',
      4: 'Предпочтения по кафе и транспорту',
      5: 'Дополнительные пожелания',
      6: 'Финальные штрихи'
    };
    return titles[this.currentStep as keyof typeof titles];
  }
}
