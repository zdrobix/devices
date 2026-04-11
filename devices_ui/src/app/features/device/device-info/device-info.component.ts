import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceService } from 'src/app/core/services/device/device.service';
import { Device } from 'src/app/core/models/device.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.component.html',
  styleUrls: ['./device-info.component.css']
})
export class DeviceInfoComponent implements OnInit, OnDestroy {
  device?: Device;
  descriptionText: string = '';
  isLoadingAi: boolean = false; 
  descriptionSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private deviceService: DeviceService,
  ) {}

  ngOnDestroy(): void {
    this.descriptionSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.deviceService.getDeviceById(id).subscribe({
        next: (response) => {
          this.device = response;
          this.descriptionText = response.description;
        }
      });
    }
  }

  get deviceParams() {
    if (!this.device) return [];
    return [
      { label: 'Name', value: this.device.name },
      { label: 'Manufacturer', value: this.device.manufacturer },
      { label: 'Type', value: this.device.type },
      { label: 'OS', value: this.device.operatingSystem },
      { label: 'OS Version', value: this.device.operatingSystemVersion },
      { label: 'Processor', value: this.device.processor },
      { label: 'RAM', value: this.device.ram }
    ];
  }

  generateDescription() {
    if (!this.device) return;
    this.isLoadingAi = true;
    this.descriptionText = 'Generating description...';
    
    this.descriptionSubscription =  this.deviceService.describeDevice(this.device.id).subscribe({
      next: (response) => {
        this.descriptionText = response;
        this.isLoadingAi = false;
      }
    });
  }
}