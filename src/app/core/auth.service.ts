import { Injectable } from '@angular/core';

export type UserRole = 'member' | 'admin';

export interface UserSession {
  login: string;
  role: UserRole;
  memberId?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly key = 'unjci_session';

  login(login: string, role: UserRole): UserSession {
    const session = { login, role };
    sessionStorage.setItem(this.key, JSON.stringify(session));
    return session;
  }

  loginMember(login: string, password: string): UserSession | null {
    const normalizedLogin = login.trim().toLowerCase();
    const members = JSON.parse(localStorage.getItem('unjci_members') || '[]') as Array<{
      id: string;
      login?: string;
      password?: string;
    }>;
    const member = members.find(item =>
      item.login?.trim().toLowerCase() === normalizedLogin && item.password === password
    );

    if (!member) return null;
    const session: UserSession = { login: normalizedLogin, role: 'member', memberId: member.id };
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
