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
  selectedFile?: File;

  constructor(private api: ApiService) {
    this.api.getSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;

        if (this.subjects.length > 0) {
          this.subjectId = this.subjects[0].id;
        }
      },
      error: () => {
        this.subjects = [];
        this.errorMessage = 'Could not load subjects from the backend.';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.selectedFile = file;
    this.fileName = file ? file.name : '';

    if (this.fileName) {
      this.url = '';
    }

    this.errorMessage = '';
    this.successMessage = '';
  }

  add(): void {
    const hasUrl = this.url.trim().length > 0;
    const hasFile = Boolean(this.selectedFile);

    if (!this.title.trim()) {
      this.errorMessage = 'Enter title.';
      this.successMessage = '';
      return;
    }

    if (!hasUrl && !hasFile) {
      this.errorMessage = 'Choose a file to upload.';
      this.successMessage = '';
      return;
    }

    if (hasUrl && !hasFile) {
      this.errorMessage = 'Current backend accepts file uploads only.';
      this.successMessage = '';
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Choose a file to upload.';
      this.successMessage = '';
      return;
    }

    this.api.addMaterial({
      title: this.title.trim(),
      subjectId: Number(this.subjectId),
      file: this.selectedFile
    }).subscribe({
      next: (material) => {
        this.errorMessage = '';
        this.successMessage = 'Material uploaded successfully!';
        this.storeUploadedMaterialId(material.id);
        this.title = '';
        this.url = '';
        this.fileName = '';
        this.selectedFile = undefined;
      },
      error: () => {
        this.errorMessage = 'Upload failed. Make sure you are logged in and selected a file.';
        this.successMessage = '';
      }
    });
  }

  private storeUploadedMaterialId(materialId: number): void {
    const existingIds = this.getUploadedMaterialIds();
    const nextIds = Array.from(new Set([...existingIds, materialId]));
    localStorage.setItem('uploaded_material_ids', JSON.stringify(nextIds));
  }

  private getUploadedMaterialIds(): number[] {
    const storedIds = localStorage.getItem('uploaded_material_ids');

    if (!storedIds) {
      return [];
    }

    try {
      return JSON.parse(storedIds) as number[];
    } catch {
      return [];
    }
  }
}
