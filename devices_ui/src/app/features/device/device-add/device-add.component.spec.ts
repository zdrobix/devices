import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceAddComponent } from './device-add.component';

describe('DeviceAddComponent', () => {
  let component: DeviceAddComponent;
  let fixture: ComponentFixture<DeviceAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceAddComponent]
    });
    fixture = TestBed.createComponent(DeviceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
