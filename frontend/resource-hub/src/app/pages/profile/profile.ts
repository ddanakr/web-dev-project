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
  readonly username = localStorage.getItem('current_username') ?? 'Guest user';
  readonly email = 'Email is not available from the current backend yet.';
  favorites: Material[] = [];

  constructor(private api: ApiService) {
    this.api.getFavoriteMaterials().subscribe({
      next: (favorites) => {
        this.favorites = favorites;
      },
      error: () => {
        this.favorites = [];
      }
    });
  }

  get uploadCount(): number {
    return this.getUploadedMaterialIds().length;
  }

  get favoriteCount(): number {
    return this.favorites.length;
  }

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? '?' : '';
    return `${'?'.repeat(fullStars)}${halfStar}`;
  }

  private getUploadedMaterialIds(): number[] {
    const storedIds = localStorage.getItem('uploaded_material_ids');

    if (!storedIds) {
      return [];
    }

    try {
      return JSON.parse(storedIds) as number[];
    } catch {
      return [];
    }
  }
}
