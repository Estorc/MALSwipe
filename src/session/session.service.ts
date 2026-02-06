import { Injectable } from '@angular/core';

const SERVER_IP = "decimally-ungummed-benito.ngrok-free.dev";

@Injectable({ providedIn: 'root' })
export class SessionService {
  private sessionId: string | null = null;

  constructor() {
    this.load();
  }

  async load() {
    const saved = sessionStorage.getItem('sessionId');
    console.log(`Start logging.`)
    if (saved) {
      this.sessionId = JSON.parse(saved);
      if (await this.checkSession(this.sessionId)) {
        console.log(`Already connected!`)
      } else {
        this.sessionId = null;
        console.log( `Session ID found but expired. Please create a new session.\n`);
      }
    } else {
      this.sessionId = null;
      console.log(`No session ID found. Please create a new session.\n`);
    }
  }

  save() {
    sessionStorage.setItem('sessionId', JSON.stringify(this.sessionId));
  }

  isConnected() : boolean {
    return this.sessionId != null;
  }

  async checkSession(sessionId: string | null): Promise<boolean> {
    if (!sessionId) return false;
    try {
      const res = await fetch(`https://${SERVER_IP}/session-exists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      return res.status === 200;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async createSession(): Promise<void> {
    const res = await fetch(`https://${SERVER_IP}/create-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: "{}"
    });
    const data = await res.json();
    this.sessionId = data.sessionId;
    this.save();
  }

  // <-- LA METHODE CONNECT EXISTE BIEN ICI
  async connect(): Promise<void> {
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
      console.log('Failed to get reader from response body.\n');
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
        console.log(`Message: ${message}\n`);
      }
    }
  }

  async search(animeName : string): Promise<any> {
    if (!animeName) {
      console.log('Veuillez entrer un nom d’anime.');
      return null;
    }

    if (!this.sessionId) {
      console.log('Session expirée. Veuillez vous reconnecter.');
      return null;
    }

    const options = { q: animeName, limit: 100, nsfw : true};

    try {
      const res = await fetch(`https://decimally-ungummed-benito.ngrok-free.dev/search-anime`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: this.sessionId, options })
      });

      const data = await res.json();

      console.log(`Résultats pour "${animeName}":`, data.results);

      return data.results;

    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  }
}
