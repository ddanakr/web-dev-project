import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { SubjectsComponent } from './pages/subjects/subjects';
import { MaterialsComponent } from './pages/materials/materials';
import { ProfileComponent } from './pages/profile/profile';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'subjects', component: SubjectsComponent },
  { path: 'materials', component: MaterialsComponent },
  { path: 'profile', component: ProfileComponent }
];