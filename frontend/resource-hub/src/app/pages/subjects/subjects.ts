import { Component } from '@angular/core';
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
}

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './subjects.html',
  styleUrl: './subjects.css',
})
export class SubjectsComponent {
  subjects: SubjectPreview[] = [];
  searchQuery = '';
  errorMessage = '';

  constructor(private api: ApiService) {
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

  toggleDescription(subjectId: number): void {
    this.subjects = this.subjects.map((subject) =>
      subject.id === subjectId ? { ...subject, expanded: !subject.expanded } : subject
    );
  }

  toggleFavorite(materialId: number): void {
    this.api.toggleFavorite(materialId).subscribe({
      next: () => this.refreshSubjects(),
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

  private refreshSubjects(): void {
    const expansionState = new Map(this.subjects.map((subject) => [subject.id, subject.expanded]));
    this.errorMessage = '';

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
          previewMaterials: materials.filter((material) => material.subjectId === subject.id).slice(0, 3)
        }));
      },
      error: () => {
        this.subjects = [];
        this.errorMessage = 'Could not load subjects from the backend.';
      }
    });
  }
}
