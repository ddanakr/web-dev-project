import { Component } from '@angular/core';
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
  readonly username = 'alex_developer';
  readonly email = 'alex@example.com';

  constructor(private api: ApiService) {}

  get uploads(): Material[] {
    return this.api.getMaterials();
  }

  get favorites(): Material[] {
    return this.api.getFavoriteMaterials();
  }

  get uploadCount(): number {
    return this.uploads.length;
  }

  get favoriteCount(): number {
    return this.favorites.length;
  }

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? '?' : '';
    return `${'?'.repeat(fullStars)}${halfStar}`;
  }
}
