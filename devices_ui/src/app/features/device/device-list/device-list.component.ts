import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, combineLatest, BehaviorSubject, Subject } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { Device } from 'src/app/core/models/device.model';
import { DeviceService } from 'src/app/core/services/device/device.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit, OnDestroy {
  private allDevices$ = new BehaviorSubject<Device[]>([]);
  private destroy$ = new Subject<void>();

  filteredDevices$!: Observable<Device[]>;
  totalDevices$!: Observable<number>;

  searchControl = new FormControl('');
  typeFilter = new FormControl('');
  osFilter = new FormControl('');
  assignmentFilter = new FormControl('');

  deviceTypes: string[] = [];
  operatingSystems: string[] = [];

  get activeFilterCount(): number {
    return [
      this.searchControl.value,
      this.typeFilter.value,
      this.osFilter.value,
      this.assignmentFilter.value,
    ].filter(Boolean).length;
  }

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    this.loadDevices();
    this.setupFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDevices(): void {
    this.deviceService.getAllDevices()
      .pipe(takeUntil(this.destroy$))
      .subscribe(devices => {
        this.allDevices$.next(devices);
        this.deviceTypes = [...new Set(devices.map(d => d.type))].sort();
        this.operatingSystems = [...new Set(devices.map(d => d.operatingSystem))].sort();
      });
  }

  private setupFilters(): void {
    const search$ = this.searchControl.valueChanges.pipe(
      startWith(''), debounceTime(250), distinctUntilChanged()
    );
    const type$ = this.typeFilter.valueChanges.pipe(startWith(''));
    const os$ = this.osFilter.valueChanges.pipe(startWith(''));
    const assignment$ = this.assignmentFilter.valueChanges.pipe(startWith(''));

    this.filteredDevices$ = combineLatest([
      this.allDevices$, search$, type$, os$, assignment$
    ]).pipe(
      map(([devices, search, type, os, assignment]) => {
        const term = (search ?? '').toLowerCase();
        return devices.filter(device => {
          const matchesSearch = !term ||
            device.name.toLowerCase().includes(term) ||
            device.manufacturer.toLowerCase().includes(term);
          const matchesType = !type || device.type === type;
          const matchesOs = !os || device.operatingSystem === os;
          const matchesAssignment =
            !assignment ||
            (assignment === 'assigned' && !!device.usedBy) ||
            (assignment === 'unassigned' && !device.usedBy);
          return matchesSearch && matchesType && matchesOs && matchesAssignment;
        });
      })
    );

    this.totalDevices$ = this.allDevices$.pipe(map(d => d.length));
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.typeFilter.setValue('');
    this.osFilter.setValue('');
    this.assignmentFilter.setValue('');
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this device?')) {
      this.deviceService.deleteDevice(id).subscribe({
        next: () => this.loadDevices(),
        error: (err) => console.error('Delete failed', err)
      });
    }
  }
}