import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
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
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  title = '';
  url = '';
  fileName = '';
  subjectId = 1;
  errorMessage = '';
  successMessage = '';
  subjects: Subject[] = [];
  selectedFile?: File;
  subjectsLoadFailed = false;
  isSubmitting = false;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.api.getSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        this.subjectsLoadFailed = false;

        if (this.subjects.length > 0) {
          this.subjectId = this.subjects[0].id;
        }
      },
      error: () => {
        this.subjects = [];
        this.subjectsLoadFailed = true;
        this.errorMessage = 'Could not load subjects from the backend.';
      }
    });
  }

  get hasSubjects(): boolean {
    return this.subjects.length > 0;
  }

  triggerFilePicker(): void {
    this.fileInput?.nativeElement.click();
  }

  onUrlChange(value: string): void {
    this.url = value;

    if (this.url.trim().length > 0) {
      this.selectedFile = undefined;
      this.fileName = '';
      this.resetNativeFileInput();
    }

    if (!this.subjectsLoadFailed) {
      this.errorMessage = '';
    }
    this.successMessage = '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.selectedFile = file;
    this.fileName = file ? file.name : '';

    if (this.fileName) {
      this.url = '';
    }

    if (!this.subjectsLoadFailed) {
      this.errorMessage = '';
    }
    this.successMessage = '';
  }

  add(): void {
    const hasUrl = this.url.trim().length > 0;
    const hasFile = Boolean(this.selectedFile);

    if (this.isSubmitting) {
      return;
    }

    if (!this.title.trim()) {
      this.errorMessage = 'Enter title.';
      this.successMessage = '';
      return;
    }

    if (!this.hasSubjects) {
      this.errorMessage = 'No subjects are available for upload yet.';
      this.successMessage = '';
      return;
    }

    if (!hasUrl && !hasFile) {
      this.errorMessage = 'Choose one source: file or URL.';
      this.successMessage = '';
      return;
    }

    if (hasUrl && hasFile) {
      this.errorMessage = 'Use only one source: either file or URL.';
      this.successMessage = '';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.api.addMaterial({
      title: this.title.trim(),
      subjectId: Number(this.subjectId),
      file: this.selectedFile,
      url: hasUrl ? this.url.trim() : undefined
    })
      .pipe(finalize(() => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
      next: (material) => {
        this.successMessage = 'Material uploaded successfully!';
        this.storeUploadedMaterialId(material.id);
        this.resetForm();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.error?.non_field_errors?.[0]
          ?? error.error?.file?.[0]
          ?? error.error?.url?.[0]
          ?? error.error?.title?.[0]
          ?? error.message
          ?? 'Upload failed. Make sure you are logged in and selected a valid file or URL.';
        this.successMessage = '';
        this.cdr.detectChanges();
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

  private resetForm(): void {
    this.title = '';
    this.url = '';
    this.fileName = '';
    this.selectedFile = undefined;
    this.resetNativeFileInput();
  }

  private resetNativeFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
