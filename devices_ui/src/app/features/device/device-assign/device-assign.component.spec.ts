import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceAssignComponent } from './device-assign.component';

describe('DeviceAssignComponent', () => {
  let component: DeviceAssignComponent;
  let fixture: ComponentFixture<DeviceAssignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceAssignComponent]
    });
    fixture = TestBed.createComponent(DeviceAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
