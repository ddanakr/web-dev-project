import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  readonly highlights = [
    {
      icon: 'fa-book-open',
      title: 'Curated Subjects',
      text: 'Browse modern topics like Web Development, OOP, Networks, and Ethical Design.'
    },
    {
      icon: 'fa-cloud-arrow-up',
      title: 'Easy Uploads',
      text: 'Add useful materials by URL or file and attach them to the right subject.'
    },
    {
      icon: 'fa-heart',
      title: 'Save Favorites',
      text: 'Mark the best materials and keep them ready in your profile page.'
    }
  ];

  readonly stats = [
    { value: '4', label: 'Core Subjects' },
    { value: '16+', label: 'Starter Materials' },
    { value: '1', label: 'Shared Hub' }
  ];
}
