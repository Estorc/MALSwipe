import { Component } from '@angular/core';
// Importe les modules nécessaires pour les boutons, les icônes et les dividers
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-tab-bar', // Utilise ce sélecteur dans ton app.component.html
  standalone: true,        // Important pour utiliser les "imports" ci-dessous
  imports: [MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './tab-bar.html', // Vérifie que le nom du fichier est bien celui-là
  styleUrls: ['./tab-bar.scss']  // Vérifie l'extension .scss ou .css
})
export class TabBarComponent {}