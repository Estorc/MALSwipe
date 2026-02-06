import { Component, HostBinding, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'anime-card',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './anime-card.component.html',
  styleUrl: './anime-card.component.scss'
})
export class AnimeCardComponent {
    @Input() anime: any;
};