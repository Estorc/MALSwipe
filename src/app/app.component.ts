// app.component.ts
import { Component } from '@angular/core';
import { SessionService } from '../session/session.service';
import { RouterOutlet, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { AnimeCardComponent } from '../anime-card/anime-card.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    FormsModule,
    NgFor,
    NgIf,
    AnimeCardComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  animeName: string = '';
  animes: any[] = [];

  constructor(private router: Router, private session: SessionService) {
  
  }

  goTo(page: string) {
    this.router.navigate([page]);
  }

  isConnected() : boolean {
    return this.session.isConnected();
  }

  async onConnectClick() {
    await this.session.connect();
  }


  async onSearchAnime() {

    let data = await this.session.search(this.animeName);
    if (data) {
      this.animes = [];
      data.forEach((anime: any) => {
        this.animes.push(anime.node); // mettre dans le tableau pour le *ngFor
      });
    }
  }
}
