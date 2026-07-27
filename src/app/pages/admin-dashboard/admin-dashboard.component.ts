import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { MemberApplication, MemberStatus } from '../../core/member.model';
import { MemberService } from '../../core/member.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  members: MemberApplication[] = [];
  search = '';
  statusFilter = '';

  constructor(
    private readonly memberService: MemberService,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  get filteredMembers(): MemberApplication[] {
    const query = this.search.trim().toLowerCase();
    return this.members.filter(member => {
      const matchesText = !query ||
        `${member.firstName} ${member.lastName} ${member.memberNumber} ${member.personalEmail}`
          .toLowerCase().includes(query);
      return matchesText && (!this.statusFilter || member.status === this.statusFilter);
    });
  }

  count(status: MemberStatus): number {
    return this.members.filter(member => member.status === status).length;
  }

  setStatus(member: MemberApplication, status: MemberStatus): void {
    this.memberService.updateStatus(member.id, status);
    this.refresh();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private refresh(): void {
    this.members = this.memberService.getAll().reverse();
  }
}
