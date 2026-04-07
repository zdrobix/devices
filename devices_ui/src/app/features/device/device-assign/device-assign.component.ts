import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Device } from 'src/app/core/models/device.model';
import { User } from 'src/app/core/models/user.model';
import { DeviceService } from 'src/app/core/services/device/device.service';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-device-assign',
  templateUrl: './device-assign.component.html',
  styleUrls: ['./device-assign.component.css']
})
export class DeviceAssignComponent implements OnInit, OnDestroy {
  id: number = 0;
  device?: Device;
  users$?: Observable<User[]>;
  selectedUserId: number = 0;
  
  private deviceSubscription?: Subscription;
  private getUsersSubscription?: Subscription;
  private allUsers: User[] = []; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deviceService: DeviceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.deviceSubscription = this.deviceService.getDeviceById(this.id).subscribe({
        next: (response) => {
          this.device = response;
          this.selectedUserId = response.usedBy?.id || 0;
        }
      });
    }

    this.users$ = this.userService.getUsers();
    this.getUsersSubscription = this.userService.getUsers().subscribe(users => this.allUsers = users);
  }

  onFormSubmit() {
    if (!this.device || this.id === 0) return;

    
    const selectedUser = this.allUsers.find(u => u.id === Number(this.selectedUserId)) || null;

    const updatedDevice = {
      ...this.device,
      usedBy: selectedUser
    };
    if (this.selectedUserId === 0) {
      updatedDevice.usedBy = null;
    }

    this.deviceService.updateDevice(this.id, updatedDevice).subscribe({
      next: () => {
        this.router.navigateByUrl('/devices');
      },
      error: (err) => {
        console.error('Assignment failed:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.deviceSubscription?.unsubscribe();
    this.getUsersSubscription?.unsubscribe();
  }
}