import { Component, ChangeDetectorRef} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api';
import { Material } from '../../models/material';
import { Subject } from '../../models/subject';

interface SubjectPreview {
  id: number;
  name: string;
  description?: string;
  expanded: boolean;
  previewMaterials: Material[];
  totalMaterials: number;
}

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './subjects.html',
  styleUrl: './subjects.css',
})
export class SubjectsComponent {
  private readonly previewLimit = 3;
  subjects: SubjectPreview[] = [];
  searchQuery = '';
  errorMessage = '';
  loadFailed = false;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {
    this.refreshSubjects();
  }

  get filteredSubjects(): SubjectPreview[] {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      return this.subjects;
    }

    return this.subjects.filter((subject) =>
      subject.name.toLowerCase().includes(query) ||
      (subject.description ?? '').toLowerCase().includes(query)
    );
  }

  get showEmptySearchState(): boolean {
    return !this.loadFailed && this.subjects.length > 0 && this.filteredSubjects.length === 0;
  }

  get showEmptySubjectsState(): boolean {
    return !this.loadFailed && this.subjects.length === 0;
  }

  toggleDescription(subjectId: number): void {
    this.subjects = this.subjects.map((subject) =>
      subject.id === subjectId ? { ...subject, expanded: !subject.expanded } : subject
    );
  }

  toggleFavorite(materialId: number): void {
    this.subjects = this.subjects.map((subject) => ({
      ...subject,
      previewMaterials: subject.previewMaterials.map((material) =>
        material.id === materialId
          ? { ...material, isFavorite: !material.isFavorite }
          : material
      )
    }));

    this.api.toggleFavorite(materialId).subscribe({
      error: () => {
        // откатываем если ошибка
        this.subjects = this.subjects.map((subject) => ({
          ...subject,
          previewMaterials: subject.previewMaterials.map((material) =>
            material.id === materialId
              ? { ...material, isFavorite: !material.isFavorite }
              : material
          )
        }));
        this.errorMessage = 'Could not update favorites. Please log in first.';
      }
    });
  }

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? '?' : '';
    return `${'★'.repeat(fullStars)}${halfStar}`;
  }

  getHiddenMaterialsCount(subject: SubjectPreview): number {
    return Math.max(0, subject.totalMaterials - subject.previewMaterials.length);
  }

  onDownload(materialId: number): void {
    console.log('onDownload called', materialId);
    this.subjects = this.subjects.map((subject) => ({
      ...subject,
      previewMaterials: subject.previewMaterials.map((m) =>
        m.id === materialId ? { ...m, downloads: (m.downloads ?? 0) + 1 } : m
      )
    }));
    this.api.trackDownload(materialId).subscribe({
      next: () => console.log('tracked'),
      error: (err) => console.error(err)
    });
  }

  private refreshSubjects(): void {
    const expansionState = new Map(this.subjects.map((subject) => [subject.id, subject.expanded]));
    this.errorMessage = '';
    this.loadFailed = false;

    forkJoin({
      subjects: this.api.getSubjects(),
      materials: this.api.getMaterials()
    }).subscribe({
      next: ({ subjects, materials }) => {
        this.subjects = subjects.map((subject: Subject) => ({
          id: subject.id,
          name: subject.name,
          description: subject.description,
          expanded: expansionState.get(subject.id) ?? false,
          previewMaterials: materials
            .filter((material) => material.subjectId === subject.id)
            .slice(0, this.previewLimit),
          totalMaterials: materials.filter((material) => material.subjectId === subject.id).length
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        this.subjects = [];
        this.loadFailed = true;
        this.errorMessage = 'Could not load subjects from the backend.';
      }
    });
  }
}
