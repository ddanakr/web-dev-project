import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';
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
  errorMessage = '';

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap
      .pipe(
        map((params) => Number(params.get('id'))),
        distinctUntilChanged()
      )
      .subscribe((subjectId) => {
        if (Number.isNaN(subjectId)) {
          this.materials = [];
          this.subject = undefined;
          this.errorMessage = 'Subject not found.';
          return;
        }

        this.loadPage(subjectId);
      });
  }

  toggleFavorite(materialId: number): void {
    this.api.toggleFavorite(materialId).subscribe({
      next: () => {
        const subjectId = Number(this.route.snapshot.paramMap.get('id'));

        if (!Number.isNaN(subjectId)) {
          this.loadPage(subjectId);
        }
      },
      error: () => {
        this.errorMessage = 'Could not update favorites. Please log in first.';
      }
    });
  }

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? '?' : '';
    return `${'?'.repeat(fullStars)}${halfStar}`;
  }

  private loadPage(subjectId: number): void {
    this.errorMessage = '';

    this.api.getSubjectById(subjectId).subscribe({
      next: (subject) => {
        this.subject = subject;
      },
      error: () => {
        this.subject = undefined;
      }
    });

    this.api.getMaterialsBySubject(subjectId).subscribe({
      next: (materials) => {
        this.materials = materials;
      },
      error: () => {
        this.materials = [];
        this.errorMessage = 'Could not load materials from the backend.';
      }
    });
  }
}
