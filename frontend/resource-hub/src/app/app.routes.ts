import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { SubjectsComponent } from './pages/subjects/subjects';
import { MaterialsComponent } from './pages/materials/materials';
import { UploadComponent } from './pages/upload/upload';
import { ProfileComponent } from './pages/profile/profile';

export const routes: Routes = [
  { path: '', redirectTo: 'subjects', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'subjects', component: SubjectsComponent },
  { path: 'materials/:id', component: MaterialsComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'profile', component: ProfileComponent }
];
