import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

  login(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Enter username and password';
      return;
    }

    localStorage.setItem('access_token', 'mock-jwt-token');
    this.errorMessage = '';
    this.router.navigate(['/subjects']);
  }
}
