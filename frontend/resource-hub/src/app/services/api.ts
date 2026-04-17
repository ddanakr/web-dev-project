import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Subject } from '../models/subject';
import { Material } from '../models/material';

interface LoginResponse {
  token: string;
}

interface StatusResponse {
  status: string;
}

interface MaterialUploadPayload {
  title: string;
  subjectId: number;
  file: File;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8000/api';
  private readonly mediaBaseUrl = 'http://localhost:8000';
  private readonly subjectDescriptions = new Map<string, string>([
    [
      'Web Development',
      'Modern web technologies including HTML, CSS, JavaScript, Angular, React, Node.js, and responsive design.'
    ],
    [
      'Object-Oriented Programming and Design',
      'SOLID principles, design patterns, UML, encapsulation, inheritance, polymorphism, and abstraction.'
    ],
    [
      'IT Infrastructure and Computer Networks',
      'TCP/IP, DNS, routing, switching, cloud computing, network security, and systems administration.'
    ],
    [
      'Ethical Digital Design',
      'Accessibility, inclusive design, privacy by design, sustainable web practices, and ethical interfaces.'
    ]
  ]);

  getSubjects(): Observable<Subject[]> {
    return this.http
      .get<Subject[]>(`${this.apiBaseUrl}/subjects/`)
      .pipe(map((subjects) => subjects.map((subject) => this.mapSubject(subject))));
  }

  getSubjectById(subjectId: number): Observable<Subject | undefined> {
    return this.getSubjects().pipe(
      map((subjects) => subjects.find((subject) => subject.id === subjectId))
    );
  }

  getMaterials(subjectId?: number): Observable<Material[]> {
    let params = new HttpParams();

    if (subjectId) {
      params = params.set('subject', String(subjectId));
    }

    return this.http
      .get<Material[]>(`${this.apiBaseUrl}/materials/`, { params })
      .pipe(map((materials) => materials.map((material) => this.mapMaterial(material))));
  }

  getMaterialsBySubject(subjectId: number): Observable<Material[]> {
    return this.getMaterials(subjectId);
  }

  getFavoriteMaterials(): Observable<Material[]> {
    return this.getMaterials().pipe(
      map((materials) => materials.filter((material) => material.isFavorite))
    );
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiBaseUrl}/login/`, {
      username,
      password
    });
  }

  logout(): Observable<StatusResponse> {
    return this.http.post<StatusResponse>(`${this.apiBaseUrl}/logout/`, {});
  }

  toggleFavorite(materialId: number): Observable<StatusResponse> {
    return this.http.post<StatusResponse>(`${this.apiBaseUrl}/materials/${materialId}/favorite/`, {});
  }

  rate(materialId: number, value: number): Observable<StatusResponse> {
    return this.http.post<StatusResponse>(`${this.apiBaseUrl}/rate/`, {
      material_id: materialId,
      value
    });
  }

  addMaterial(payload: MaterialUploadPayload): Observable<Material> {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('subjectId', String(payload.subjectId));
    formData.append('file', payload.file);

    return this.http
      .post<Material>(`${this.apiBaseUrl}/materials/`, formData)
      .pipe(map((material) => this.mapMaterial(material)));
  }

  private mapSubject(subject: Subject): Subject {
    return {
      ...subject,
      description: subject.description ?? this.subjectDescriptions.get(subject.name) ?? ''
    };
  }

  private mapMaterial(material: Material): Material {
    const fileUrl = material.file
      ? material.file.startsWith('http')
        ? material.file
        : `${this.mediaBaseUrl}${material.file}`
      : '';

    return {
      ...material,
      url: material.url ?? fileUrl,
      downloads: material.downloads ?? 0,
      rating: Number(material.rating ?? 0),
      isFavorite: Boolean(material.isFavorite)
    };
  }
}
