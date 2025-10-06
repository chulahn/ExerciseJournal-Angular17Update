import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="container">
      <h1>Exercise Journal 🏋️‍♂️</h1>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 2rem auto;
      font-family: system-ui, sans-serif;
      padding: 1rem;
    }
  `]
})
export class AppComponent {}