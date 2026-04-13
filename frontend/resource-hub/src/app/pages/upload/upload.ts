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
  }

  add(): void {
    this.api.addMaterial({
      id: Date.now(),
      title: this.title,
      rating: 0,
      subjectId: Number(this.subjectId),
      url: this.url,
      fileName: this.fileName,
      downloads: 0,
      isFavorite: false
    });

    this.title = '';
    this.url = '';
    this.fileName = '';
  }
}
