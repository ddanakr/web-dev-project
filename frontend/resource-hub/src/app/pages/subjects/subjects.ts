import { Component } from '@angular/core';
import { ApiService } from '../../services/api';
import { Subject } from '../../models/subject';

@Component({
  selector: 'app-subjects',
  standalone: true,
  templateUrl: './subjects.html',
  styleUrl: './subjects.css',
})
export class SubjectsComponent {

  subjects: Subject[] = [];

  constructor(private api: ApiService) {
    this.subjects = this.api.getSubjects();
  }
}