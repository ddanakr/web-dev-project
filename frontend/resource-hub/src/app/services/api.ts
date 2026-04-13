import { Injectable } from '@angular/core';
import { Subject } from '../models/subject';
import { Material } from '../models/material';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  getSubjects(): Subject[] {
  try {
    return [
      { id: 1, name: 'Math' },
      { id: 2, name: 'Physics' }
    ];
  } catch (error) {
    console.error('API error:', error);
    return [];
  }
}

  getMaterials(): Material[] {
    try {
      return [
        { id: 1, title: 'Math Notes', rating: 5 },
        { id: 2, title: 'Physics Book', rating: 3 }
      ];
    } catch (error) {
      console.error('API error:', error);
      return [];
    }
  }

}