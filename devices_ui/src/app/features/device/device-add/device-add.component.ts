import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeviceService } from 'src/app/core/services/device/device.service';

export interface AddDeviceRequest {
  name: string;
  manufacturer: string;
  type: string;
  operatingSystem: string;
  operatingSystemVersion: string;
  processor: string;
  ram: string;
  description: string;
}

@Component({
  selector: 'app-add-device',
  templateUrl: './device-add.component.html',
  styleUrls: ['./device-add.component.css']
})
export class DeviceAddComponent implements OnDestroy {
  model: AddDeviceRequest;
  private addDeviceSubscription?: Subscription;

  constructor(private router: Router, private deviceService: DeviceService) {
    this.model = {
      name: '',
      manufacturer: '',
      type: '',
      operatingSystem: '',
      operatingSystemVersion: '',
      processor: '',
      ram: '',
      description: ''
    };
  }

  onFormSubmit() {
    if (!this.model.name || !this.model.manufacturer) {
      return;
    }

    this.addDeviceSubscription = this.deviceService.addDevice(this.model).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/devices');
      },
      error: (err) => {
        console.error('Error adding device:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.addDeviceSubscription?.unsubscribe();
  }
}