import { Component } from '@angular/core';
import { ApiService } from '../../services/api';
import { FormsModule } from '@angular/forms';
import { Material } from '../../models/material';

@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './materials.html',
  styleUrl: './materials.css',
})
export class MaterialsComponent {

  materials: Material[] = [];

  constructor(private api: ApiService) {
    this.materials = this.api.getMaterials();
  }

  download(material: any) {
    alert('Downloading ' + material.title);
  }

  like(material: any) {
    material.rating += 1;
  }

  toggleDetails(material: any) {
    material.show = !material.show;
  }

  delete(material: any) {
    this.materials = this.materials.filter(m => m.id !== material.id);
  }

  title: string = '';
  description: string = '';
  errorMessage: string = '';

  addMaterial() {
    this.materials.push({
      id: Date.now(),
      title: this.title,
      rating: 0
    });

    this.title = '';
    this.description = '';
  }
}