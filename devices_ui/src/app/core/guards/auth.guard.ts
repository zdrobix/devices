import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  /*
  Some routes are restricted, and can't be visited unless the user is logged in.
  If the user is logged in, this method returns an Observable, otherwise a tree, redirecting the user.
  */
  canActivate(): Observable<boolean | UrlTree> {
    return this.userService.getLoggedInUser().pipe(
      map(user => user ? true : this.router.createUrlTree(['/']))
    );
  }
}