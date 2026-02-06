import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { TabBarComponent } from './tab-bar/tab-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  // C'est ici qu'il faut ajouter TabBarComponent !
  imports: [RouterOutlet, TabBarComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private router: Router) {}

  goTo(page: string) {
    this.router.navigate([page]);
  }
}