import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from 'src/app/core/models/device.model';
import { DeviceService } from 'src/app/core/services/device/device.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit {
  devices$!: Observable<Device[]>;

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices() {
    this.devices$ = this.deviceService.getAllDevices();
    console.log('Loaded devices:', this.devices$.forEach(device => console.log(device)));
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this device?')) {
      this.deviceService.deleteDevice(id).subscribe({
        next: () => {
          this.loadDevices();
        },
        error: (err) => console.error('Delete failed', err)
      });
    }
  }
}