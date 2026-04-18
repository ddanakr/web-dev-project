import { ChangeDetectorRef, Component } from '@angular/core';
import { Material } from '../../models/material';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent {
  username = '';
  email = '';
  uploadCount = 0;
  favorites: Material[] = [];

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.api.me().subscribe({
      next: (user) => {
        this.username = user.username;
        this.email = user.email;
        this.uploadCount = user.uploadCount;
        this.cdr.detectChanges();
      }
    });

    this.api.getFavoriteMaterials().subscribe({
      next: (favorites) => {
        this.favorites = [...favorites];
        this.cdr.detectChanges();
      },
      error: () => {
        this.favorites = [];
      }
    });
  }

  get favoriteCount(): number {
    return this.favorites.length;
  }
}
