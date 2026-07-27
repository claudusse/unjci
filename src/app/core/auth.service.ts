import { Injectable } from '@angular/core';

export type UserRole = 'member' | 'admin';

export interface UserSession {
  login: string;
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly key = 'unjci_session';

  login(login: string, role: UserRole): UserSession {
    const session = { login, role };
    sessionStorage.setItem(this.key, JSON.stringify(session));
    return session;
  }

  getSession(): UserSession | null {
    try {
      return JSON.parse(sessionStorage.getItem(this.key) || 'null');
    } catch {
      return null;
    }
  }

  logout(): void {
    sessionStorage.removeItem(this.key);
  }
}
