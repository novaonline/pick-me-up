import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleToastComponent } from './simple-toast.component';

describe('SimpleToastComponent', () => {
  let component: SimpleToastComponent;
  let fixture: ComponentFixture<SimpleToastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
