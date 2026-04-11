import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddUserRequest } from 'src/app/core/models/add-user-request.model';
import { LoginRequest } from 'src/app/core/models/login-request.mode';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit, OnDestroy  {
  model: AddUserRequest;
  private createUserSubscription?: Subscription;

  constructor(private userService: UserService,
    private router: Router
  ) {
    this.model = {
      name: '',
      role: '',
      location: '',
      password: ''
    };
  }

  ngOnInit(): void {
  }

  onFormSubmit() {
    if (!this.model)
      return; 
    this.createUserSubscription = this.userService.createUser(this.model).subscribe({
      next: () => {
        this.router.navigate(['/devices']);
      },
      error: (error) => {}
      });
  }

  ngOnDestroy(): void {
    this.createUserSubscription?.unsubscribe();
  }
}