import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private userService = inject(UserService);
  logout() : void {
    console.log('Logging out...');
    this.userService.logout();
    console.log('Logged out.');
    window.location.reload();
  }
} 
