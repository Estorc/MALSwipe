import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] 
})

export class AppComponent {
  constructor(private router: Router) {}

  goTo(page: string) {
    this.router.navigate([page]);
  }
}
