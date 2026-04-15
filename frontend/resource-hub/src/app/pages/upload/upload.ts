import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from '../../models/subject';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './upload.html',
  styleUrl: './upload.css',
})
export class UploadComponent {
  title = '';
  url = '';
  fileName = '';
  subjectId = 1;
  errorMessage = '';
  successMessage = '';
  subjects: Subject[] = [];

  constructor(private api: ApiService) {
    this.subjects = this.api.getSubjects();

    if (this.subjects.length > 0) {
      this.subjectId = this.subjects[0].id;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.fileName = file ? file.name : '';

    if (this.fileName) {
      this.url = '';
    }

    this.errorMessage = '';
    this.successMessage = '';
  }

  add(): void {
    const hasUrl = this.url.trim().length > 0;
    const hasFile = this.fileName.trim().length > 0;

    if (!this.title.trim()) {
      this.errorMessage = 'Enter title.';
      this.successMessage = '';
      return;
    }

    if (!hasUrl && !hasFile) {
      this.errorMessage = 'Choose one source: URL or file.';
      this.successMessage = '';
      return;
    }

    if (hasUrl && hasFile) {
      this.errorMessage = 'Use only one source: URL or file.';
      this.successMessage = '';
      return;
    }

    this.errorMessage = '';
    this.successMessage = 'Material uploaded successfully!';

    this.api.addMaterial({
      id: Date.now(),
      title: this.title.trim(),
      rating: 0,
      subjectId: Number(this.subjectId),
      url: hasUrl ? this.url.trim() : '',
      fileName: hasFile ? this.fileName : '',
      downloads: 0,
      isFavorite: false
    });

    this.title = '';
    this.url = '';
    this.fileName = '';
  }
}
