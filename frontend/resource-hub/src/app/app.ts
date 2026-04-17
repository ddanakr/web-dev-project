import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ApiService } from './services/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('resource-hub');
  currentPath = '';
  isDarkMode = false;

  constructor(
    private router: Router,
    private api: ApiService
  ) {
    this.currentPath = this.router.url;
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentPath = (event as NavigationEnd).urlAfterRedirects;
      });
  }

  get isLoginPage(): boolean {
    return this.currentPath.startsWith('/login');
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  logout(event: Event): void {
    event.preventDefault();
    this.api.logout().subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession()
    });
  }

  private applyTheme(): void {
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    document.body.classList.toggle('light-mode', !this.isDarkMode);
  }

  private clearSession(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    localStorage.removeItem('current_username');
    localStorage.removeItem('uploaded_material_ids');
    this.router.navigate(['/login']);
  }
}
