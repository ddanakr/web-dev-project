import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { Material } from '../../models/material';
import { Subject } from '../../models/subject';

interface SubjectPreview {
  id: number;
  name: string;
  previewMaterials: Material[];
  totalMaterials: number;
}

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './subjects.html',
  styleUrl: './subjects.css',
})
export class SubjectsComponent {
  subjects: SubjectPreview[] = [];

  constructor(private api: ApiService) {
    this.subjects = this.api.getSubjects().map((subject: Subject) => {
      const materials = this.api.getMaterialsBySubject(subject.id);

      return {
        ...subject,
        previewMaterials: materials.slice(0, 3),
        totalMaterials: materials.length
      };
    });
  }
}
