import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { MemberApplication, MembershipHistory } from '../../core/member.model';
import { MemberService } from '../../core/member.service';

@Component({
  selector: 'app-member-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './member-dashboard.component.html',
  styleUrl: './member-dashboard.component.css',
})
export class MemberDashboardComponent implements OnInit {
  member?: MemberApplication;
  editing = false;
  saved = false;

  readonly profileForm = new FormGroup({
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    personalEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    postalAddress: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    employers: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    functionTitle: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(
    private readonly members: MemberService,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.member = this.members.getLatest();
    if (this.member) this.profileForm.patchValue(this.member);
  }

  get history(): MembershipHistory[] {
    if (!this.member) return [];
    return [{
      date: this.member.createdAt,
      label: this.member.requestType,
      amount: this.member.contributionAmount,
      status: this.member.status,
    }];
  }

  saveProfile(): void {
    if (!this.member || this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.member = this.members.updateProfile(this.member.id, this.profileForm.getRawValue());
    this.editing = false;
    this.saved = true;
    setTimeout(() => this.saved = false, 3000);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
