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
  constructor(private api: ApiService) {}

  get uploads(): Material[] {
    return this.api.getMaterials();
  }

  get favorites(): Material[] {
    return this.api.getFavoriteMaterials();
  }
}
