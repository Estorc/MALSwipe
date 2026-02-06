import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // <-- IMPORTANT
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // <-- c’est ça qu’on met pour router-outlet
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private router: Router) {}

  goTo(page: string) {
    this.router.navigate([page]);
  }
}
