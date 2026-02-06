import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-swipe',
  standalone: true,
  imports: [
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './swipe.component.html'
})
export class SwipeComponent {}
