import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { MemberApplication, MembershipHistory } from '../../core/member.model';
import { MemberService } from '../../core/member.service';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-member-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CardComponent],
  templateUrl: './member-dashboard.component.html',
  styleUrl: './member-dashboard.component.css',
})
export class MemberDashboardComponent implements OnInit {
  member?: MemberApplication;
  editing = false;
  saved = false;
  paymentSaved = false;
  addingPaymentProof = false;

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

  readonly paymentProofForm = new FormGroup({
    paymentPhone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    transactionId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private readonly members: MemberService,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const session = this.auth.getSession();
    this.member = session?.memberId ? this.members.getById(session.memberId) : undefined;
    if (this.member) {
      this.profileForm.patchValue(this.member);
      this.paymentProofForm.patchValue({
        paymentPhone: this.member.paymentPhone || '',
        transactionId: this.member.transactionId || '',
      });
    }
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

  savePaymentProof(): void {
    if (!this.member || this.paymentProofForm.invalid) {
      this.paymentProofForm.markAllAsTouched();
      return;
    }
    const proof = this.paymentProofForm.getRawValue();
    this.member = this.members.updatePaymentProof(
      this.member.id,
      proof.paymentPhone,
      proof.transactionId,
    );
    this.addingPaymentProof = false;
    this.paymentSaved = true;
    setTimeout(() => this.paymentSaved = false, 3000);
  }

  openProfile(): void {
    this.editing = true;
    this.scrollToSection('profil');
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
