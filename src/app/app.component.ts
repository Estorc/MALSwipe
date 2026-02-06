
import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnimeCardComponent } from '../anime-card/anime-card.component';
import { Router, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

export interface SearchOptions {
    q?: string;
    limit?: number;
    offset?: number;
    fields?: string[];
}

const SERVER_IP = "decimally-ungummed-benito.ngrok-free.dev";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatMenuModule, MatIconModule, FormsModule, AnimeCardComponent, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  constructor(private router: Router) {}


  @ViewChild('log') logElement!: { nativeElement: HTMLParagraphElement };
  
  title = 'BakaSwipe';
  animeName: string = '';
  animes: any[] = [];
  sessionId: string | null = null;

  async ngAfterViewInit() {
    const saved = sessionStorage.getItem('sessionId');
    this.logElement.nativeElement.textContent += `Start logging.`
    if (saved) {
      this.sessionId = JSON.parse(saved);
      if (await this.checkSession(this.sessionId)) {
        this.logElement.nativeElement.textContent += `Already connected!`
      } else {
        this.sessionId = null;
        this.logElement.nativeElement.textContent += `Session ID found but expired. Please create a new session.\n`;
      }
    } else {
      this.sessionId = null;
      this.logElement.nativeElement.textContent += `No session ID found. Please create a new session.\n`;
    }
  }

  save() {
    sessionStorage.setItem('sessionId', JSON.stringify(this.sessionId));
  }

  onHelloClick(): void {
    fetch(`https://${SERVER_IP}/hello`)
      .then(response => response.json())
      .then(data => this.logElement.nativeElement.textContent += data.message + '\n')
      .catch(error => console.error('Error:', error));
  }

  async checkSession(sessionId : string | null): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (sessionId === null) {
        this.logElement.nativeElement.textContent += 'No session ID to check.\n';
        resolve(false);
        return;
      }
      try {
        await fetch(`https://${SERVER_IP}/session-exists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sessionId: sessionId }),
          signal: AbortSignal.timeout(5000)
        })
          .then(response => {
            this.logElement.nativeElement.textContent += `Session check response: ${response.status}\n`;
            if (response.status === 200) {
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch(error => {
            console.error('Error:', error);
            resolve(false);
          });
      } catch (error) {
        console.error('Error:', error);
        resolve(false);
      }
    });
  }

  async createSession(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await fetch(`https://${SERVER_IP}/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: "{}"
      })
        .then(response => response.json())
        .then(data => {
          this.sessionId = data.sessionId;
          this.logElement.nativeElement.textContent += `Session ID: ${data.sessionId}\n`;
          this.save();
          resolve();
        })
        .catch(error => {
          console.error('Error:', error);
          resolve(error);
        });
    });
  }

  async onConnectClick(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!await this.checkSession(this.sessionId)) {
        await this.createSession();
      }
      const res = await fetch(`https://${SERVER_IP}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId: this.sessionId, redirect_uri: `https://${SERVER_IP}/callback` })
      })
      const reader = res?.body?.getReader();
      if (!reader) {
        this.logElement.nativeElement.textContent += 'Failed to get reader from response body.\n';
        reject(new Error('No reader available'));
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const message = new TextDecoder().decode(value);
        const json = JSON.parse(message);
        if (json.status === 'Need authentication') {
          const url = json.authUrl;
          // Handle the URL (e.g., open in new tab)
          window.open(url, '_blank');
        } else {
          this.logElement.nativeElement.textContent += `Message: ${message}\n`;
        }
      }
    });
  }

  async onSearchAnime(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.animes = [];
      if (!await this.checkSession(this.sessionId)) {
        this.logElement.nativeElement.textContent += 'Session expired. Please create a new session.\n';
        this.sessionId = null;
        reject(new Error('Session expired'));
        return;
      }
      if (!this.animeName) {
        this.logElement.nativeElement.textContent += 'Please enter an anime name to search.\n';
        resolve();
        return;
      }
      const options : SearchOptions = { q: this.animeName, limit: 5 };
      await fetch(`https://${SERVER_IP}/search-anime`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId: this.sessionId, options: options })
      })
        .then(response => response.json())
        .then(data => {
          this.logElement.nativeElement.textContent += `Search Results for "${this.animeName}":\n`;
          console.log(data);
          data.results.forEach((anime: any) => {
            this.animes.push(anime.node);
            this.logElement.nativeElement.textContent += `- ${JSON.stringify(anime.node)}\n`;
          });
        })
        .catch(error => {
          console.error('Error:', error)
          reject(error);
          return;
        });

    });
  }
}
