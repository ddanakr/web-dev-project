import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api';
import { Material } from '../../models/material';
import { Subject } from '../../models/subject';

@Component({
  selector: 'app-materials',
  standalone: true,
  templateUrl: './materials.html',
  styleUrl: './materials.css',
})
export class MaterialsComponent {
  materials: Material[] = [];
  subject?: Subject;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) {
    const subjectId = Number(this.route.snapshot.paramMap.get('id'));
    this.subject = this.api.getSubjects().find(item => item.id === subjectId);
    this.materials = this.api.getMaterialsBySubject(subjectId);
  }

  toggleFavorite(materialId: number): void {
    this.api.toggleFavorite(materialId);
    this.materials = [...this.materials];
  }
}
