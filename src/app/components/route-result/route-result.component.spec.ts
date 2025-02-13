import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteResultComponent } from './route-result.component';

describe('RouteResultComponent', () => {
  let component: RouteResultComponent;
  let fixture: ComponentFixture<RouteResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
