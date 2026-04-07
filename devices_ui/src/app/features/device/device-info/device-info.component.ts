import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceService } from 'src/app/core/services/device/device.service';
import { Device } from 'src/app/core/models/device.model';

@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.component.html',
  styleUrls: ['./device-info.component.css']
})
export class DeviceInfoComponent implements OnInit {
  device?: Device;
  descriptionText: string = '';

  constructor(
    private route: ActivatedRoute,
    private deviceService: DeviceService
  ) {}

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

    const generated = `This ${this.device.manufacturer} ${this.device.type} is powered by an ${this.device.processor} processor and ${this.device.ram} of RAM. It currently runs ${this.device.operatingSystem} ${this.device.operatingSystemVersion}.`;
    
    this.descriptionText = generated;
  }
}