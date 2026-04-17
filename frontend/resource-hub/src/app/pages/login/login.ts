import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

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

  constructor(
    private router: Router,
    private api: ApiService
  ) {}

  login(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Enter username and password';
      return;
    }

    this.api.login(this.username.trim(), this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('current_username', this.username.trim());
        this.errorMessage = '';
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMessage = 'Login failed. Check username and password.';
      }
    });
  }
}
