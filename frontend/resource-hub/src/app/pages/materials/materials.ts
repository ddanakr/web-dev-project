import { ChangeDetectorRef, Component } from '@angular/core';
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
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
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
    this.materials = this.materials.map((material) =>
      material.id === materialId ? { ...material, isFavorite: !material.isFavorite } : material
    );

    this.api.toggleFavorite(materialId).subscribe({
      error: () => {
        this.materials = this.materials.map((material) =>
          material.id === materialId ? { ...material, isFavorite: !material.isFavorite } : material
        );
        this.errorMessage = 'Could not update favorites. Please log in first.';
      }
    });
  }

  onDownload(materialId: number): void {
    this.api.trackDownload(materialId).subscribe({
      next: () => {
        this.materials = this.materials.map((material) =>
          material.id === materialId
            ? { ...material, downloads: (material.downloads ?? 0) + 1 }
            : material
        );
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Could not update download count.';
      }
    });
  }

  private loadPage(subjectId: number): void {
    this.errorMessage = '';

    this.api.getSubjectById(subjectId).subscribe({
      next: (subject) => {
        this.subject = subject;
        this.cdr.detectChanges();
      },
      error: () => {
        this.subject = undefined;
      }
    });

    this.api.getMaterialsBySubject(subjectId).subscribe({
      next: (materials) => {
        this.materials = [...materials];
        this.cdr.detectChanges();
      },
      error: () => {
        this.materials = [];
        this.errorMessage = 'Could not load materials from the backend.';
      }
    });
  }
}
