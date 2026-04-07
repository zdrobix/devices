import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  private userService = inject(UserService);
  private router = inject(Router);

  constructor() {} 

  canActivate(): boolean {
    if (this.userService.isLoggedIn()) { 
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}