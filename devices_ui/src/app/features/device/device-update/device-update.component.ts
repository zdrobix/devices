import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UpdateDeviceRequest } from 'src/app/core/models/update-device-request.model';
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
  templateUrl: './device-update.component.html',
  styleUrls: ['./device-update.component.css']
})
export class DeviceUpdateComponent implements OnDestroy, OnInit {
  model: UpdateDeviceRequest;
  id: number = 0;
  private updateDeviceSubscription?: Subscription;
  private getDeviceSubscription?: Subscription;

  constructor(private router: Router, private deviceService: DeviceService) {
    this.model = {
      name: '',
      manufacturer: '',
      type: '',
      operatingSystem: '',
      operatingSystemVersion: '',
      processor: '',
      ram: '',
      description: '',
      usedBy: null
    };
    this.id = Number(this.router.url.split('/').pop());
  }

  ngOnInit(): void {
    this.getDeviceSubscription =this.deviceService.getDeviceById(this.id).subscribe({
      next: (response) => {
        this.model = response;
      }
    });
  }

  onFormSubmit() {
    if (!this.model.name || !this.model.manufacturer) {
      return;
    }
    this.updateDeviceSubscription = this.deviceService.updateDevice(this.id, this.model).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/devices');
      },
      error: (err) => {
        console.error('Error updating device:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.updateDeviceSubscription?.unsubscribe();
    this.getDeviceSubscription?.unsubscribe();
  }
}