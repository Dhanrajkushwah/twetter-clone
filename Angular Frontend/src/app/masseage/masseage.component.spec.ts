import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasseageComponent } from './masseage.component';

describe('MasseageComponent', () => {
  let component: MasseageComponent;
  let fixture: ComponentFixture<MasseageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasseageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasseageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
