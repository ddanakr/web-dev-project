import { Component, ChangeDetectorRef } from '@angular/core';
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

  // toggleFavorite(materialId: number): void {
  //   this.api.toggleFavorite(materialId).subscribe({
  //     next: () => {
  //       const subjectId = Number(this.route.snapshot.paramMap.get('id'));

  //       if (!Number.isNaN(subjectId)) {
  //         this.loadPage(subjectId);
  //       }
  //     },
  //     error: () => {
  //       this.errorMessage = 'Could not update favorites. Please log in first.';
  //     }
  //   });
  // }

  toggleFavorite(materialId: number): void {
    this.materials = this.materials.map((m) =>
      m.id === materialId ? { ...m, isFavorite: !m.isFavorite } : m
    );

    this.api.toggleFavorite(materialId).subscribe({
      error: () => {
        // откат
        this.materials = this.materials.map((m) =>
          m.id === materialId ? { ...m, isFavorite: !m.isFavorite } : m
        );
        this.errorMessage = 'Could not update favorites. Please log in first.';
      }
    });
  }

  // onDownload(materialId: number): void {
  //   console.log('onDownload called', materialId);
  //   this.api.trackDownload(materialId).subscribe({
  //     next: () => console.log('download tracked'),
  //     error: (err) => console.error('track error', err)
  //   });
  // }

  onDownload(materialId: number): void {
    const material = this.materials.find(m => m.id === materialId);
    console.log('url:', material?.url, 'file:', material?.file);

    this.api.trackDownload(materialId).subscribe({
      next: () => console.log('download tracked'),
      error: (err) => console.error('track error', err)
    });
  }

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? '?' : '';
    return `${'★'.repeat(fullStars)}${halfStar}`;
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
