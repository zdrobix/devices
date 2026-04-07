import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginRequest } from 'src/app/core/models/login-request.mode';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy  {
  model: LoginRequest;
  private loginSubscription?: Subscription;

  constructor(private userService: UserService,
    private router: Router
  ) {
    this.model = {
      name: '',
      password: ''
    };
  }

  ngOnInit(): void {
    if (this.userService.user$) {
      this.router.navigate(['/account']);
    }
  }

  onFormSubmit() {
    if (!this.model)
      return;
    this.loginSubscription = this.userService.login(this.model).subscribe({
      next: () => {
        this.router.navigate(['/devices']);
      },
      error: (error) => {}
      });
  }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }
}