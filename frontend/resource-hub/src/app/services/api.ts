import { Injectable } from '@angular/core';
import { Subject } from '../models/subject';
import { Material } from '../models/material';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly subjects: Subject[] = [
    { id: 1, name: 'Web Development' },
    { id: 2, name: 'Object-Oriented Programming and Design' },
    { id: 3, name: 'IT Infrastructure and Computer Networks' },
    { id: 4, name: 'Ethical Digital Design' }
  ];

  private readonly materials: Material[] = [
    { id: 1, title: 'Advanced React Patterns', rating: 4.9, downloads: 1540, subjectId: 1, isFavorite: false },
    { id: 2, title: 'Node.js Microservices', rating: 4.8, downloads: 1120, subjectId: 1, isFavorite: false },
    { id: 3, title: 'CSS Grid & Flexbox Mastery', rating: 4.7, downloads: 2100, subjectId: 1, isFavorite: false },
    { id: 4, title: 'TypeScript for Frontend Apps', rating: 4.8, downloads: 980, subjectId: 1, isFavorite: false },
    { id: 5, title: 'Gang of Four Design Patterns', rating: 4.9, downloads: 980, subjectId: 2, isFavorite: false },
    { id: 6, title: 'SOLID Principles Deep Dive', rating: 4.8, downloads: 750, subjectId: 2, isFavorite: false },
    { id: 7, title: 'UML for System Design', rating: 4.6, downloads: 620, subjectId: 2, isFavorite: false },
    { id: 8, title: 'Refactoring Legacy OOP Code', rating: 4.7, downloads: 710, subjectId: 2, isFavorite: false },
    { id: 9, title: 'CCNA Complete Guide', rating: 4.8, downloads: 890, subjectId: 3, isFavorite: false },
    { id: 10, title: 'AWS Solutions Architect Prep', rating: 4.9, downloads: 1340, subjectId: 3, isFavorite: false },
    { id: 11, title: 'Network Security Fundamentals', rating: 4.7, downloads: 560, subjectId: 3, isFavorite: false },
    { id: 12, title: 'Routing and Switching Basics', rating: 4.6, downloads: 610, subjectId: 3, isFavorite: false },
    { id: 13, title: 'WCAG 2.1 Accessibility Guide', rating: 4.9, downloads: 430, subjectId: 4, isFavorite: false },
    { id: 14, title: 'Privacy by Design Principles', rating: 4.8, downloads: 890, subjectId: 4, isFavorite: false },
    { id: 15, title: 'Inclusive UX Writing', rating: 4.7, downloads: 520, subjectId: 4, isFavorite: false },
    { id: 16, title: 'Ethical AI Interfaces', rating: 4.8, downloads: 460, subjectId: 4, isFavorite: false }
  ];

  getSubjects(): Subject[] {
    try {
      return [...this.subjects];
    } catch (error) {
      console.error('API error:', error);
      return [];
    }
  }

  getMaterials(): Material[] {
    try {
      return [...this.materials];
    } catch (error) {
      console.error('API error:', error);
      return [];
    }
  }

  getMaterialsBySubject(subjectId: number): Material[] {
    return this.materials.filter(material => material.subjectId === subjectId);
  }

  getFavoriteMaterials(): Material[] {
    return this.materials.filter(material => material.isFavorite);
  }

  toggleFavorite(materialId: number): void {
    const material = this.materials.find(item => item.id === materialId);

    if (material) {
      material.isFavorite = !material.isFavorite;
    }
  }

  addMaterial(material: Material): void {
    this.materials.push({
      ...material,
      downloads: material.downloads ?? 0,
      url: material.url ?? '',
      fileName: material.fileName ?? '',
      isFavorite: material.isFavorite ?? false
    });
  }
}
