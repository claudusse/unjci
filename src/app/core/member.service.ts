import { Injectable } from '@angular/core';
import { MemberApplication } from './member.model';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private readonly key = 'unjci_members';

  getAll(): MemberApplication[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  getLatest(): MemberApplication | undefined {
    return this.getAll().at(-1);
  }

  getByToken(token: string): MemberApplication | undefined {
    return this.getAll().find(member => member.qrToken === token.trim());
  }

  save(application: Omit<MemberApplication, 'id' | 'memberNumber' | 'qrToken' | 'status' | 'createdAt'>): MemberApplication {
    const members = this.getAll();
    const sequence = String(members.length + 1).padStart(5, '0');
    const member: MemberApplication = {
      ...application,
      id: crypto.randomUUID(),
      memberNumber: `UNJCI-${new Date().getFullYear()}-${sequence}`,
      qrToken: crypto.randomUUID().replaceAll('-', ''),
      status: 'EN_ATTENTE',
      createdAt: new Date().toISOString()
    };
    members.push(member);
    localStorage.setItem(this.key, JSON.stringify(members));
    return member;
  }

  activate(id: string): MemberApplication | undefined {
    const members = this.getAll();
    const member = members.find(item => item.id === id);
    if (!member) return undefined;
    member.status = 'ACTIVE';
    localStorage.setItem(this.key, JSON.stringify(members));
    return member;
  }
}
