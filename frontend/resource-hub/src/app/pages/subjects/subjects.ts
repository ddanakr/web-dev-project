import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
    this.api.toggleFavorite(materialId);
    this.refreshSubjects();
  }

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? '?' : '';
    return `${'?'.repeat(fullStars)}${halfStar}`;
  }

  private refreshSubjects(): void {
    const expansionState = new Map(this.subjects.map((subject) => [subject.id, subject.expanded]));

    this.subjects = this.api.getSubjects().map((subject: Subject) => ({
      id: subject.id,
      name: subject.name,
      description: subject.description,
      expanded: expansionState.get(subject.id) ?? false,
      previewMaterials: this.api.getMaterialsBySubject(subject.id).slice(0, 3)
    }));
  }
}
