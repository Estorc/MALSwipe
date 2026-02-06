import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SessionService {

  set(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  get<T>(key: string): T | null {
    const val = sessionStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  }

  remove(key: string) {
    sessionStorage.removeItem(key);
  }
}