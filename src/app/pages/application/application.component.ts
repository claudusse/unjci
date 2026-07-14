import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MemberService } from '../../core/member.service';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './application.component.html',
  styleUrl: './application.component.css'
})
export class ApplicationComponent {
  private fb = inject(FormBuilder);
  private members = inject(MemberService);
  private router = inject(Router);
  submitted = false;
  saving = false;
  readonly statuses = ['Journaliste mensualisé (CDI/CDD)', 'Pigiste', 'Indépendant / Freelance', 'Photojournaliste', 'Journaliste honoraire / Retraité'];
  readonly functions = ['Rédacteur', 'Reporter', 'Présentateur', 'Secrétaire de rédaction', 'Rédacteur en chef', 'Photojournaliste', 'Autre'];
  readonly payments = ['Wave', 'MTN MoMo', 'Orange Money', 'Moov Money'];

  form = this.fb.group({
    firstName: ['', Validators.required], lastName: ['', Validators.required],
    birthDate: ['', Validators.required], birthPlace: ['', Validators.required],
    postalAddress: ['', Validators.required], phone: ['', Validators.required],
    personalEmail: ['', [Validators.required, Validators.email]],
    professionalStatus: ['', Validators.required], employers: ['', Validators.required],
    functionTitle: ['', Validators.required], pressCardNumber: ['', Validators.required],
    pressCardExpiry: ['', Validators.required], professionalEmail: ['', Validators.email], professionalPhone: [''],
    requestType: ['Première adhésion', Validators.required], currentMemberNumber: [''],
    pressCardFile: ['', Validators.required], cvFile: [''], photoFile: ['', Validators.required], photoDataUrl: [''],
    declarationAccepted: [false, Validators.requiredTrue], signatureName: ['', Validators.required],
    signatureDate: [new Date().toISOString().slice(0,10), Validators.required],
    contributionAmount: [10000, Validators.required], paymentMethod: ['', Validators.required],
    directoryConsent: [false], privacyAccepted: [false, Validators.requiredTrue]
  });

  constructor() {
    this.form.controls.requestType.valueChanges.subscribe(type => {
      this.form.controls.contributionAmount.setValue(type === 'Renouvellement' ? 5000 : 10000);
      if (type === 'Renouvellement') this.form.controls.currentMemberNumber.addValidators(Validators.required);
      else this.form.controls.currentMemberNumber.clearValidators();
      this.form.controls.currentMemberNumber.updateValueAndValidity();
    });
  }

  fileSelected(event: Event, control: 'pressCardFile'|'cvFile'|'photoFile') {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.form.controls[control].setValue(file.name);
    if (control === 'photoFile') {
      const reader = new FileReader();
      reader.onload = () => this.form.controls.photoDataUrl.setValue(String(reader.result));
      reader.readAsDataURL(file);
    }
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) { this.form.markAllAsTouched(); window.scrollTo({top: 0, behavior:'smooth'}); return; }
    this.saving = true;
    const member = this.members.save(this.form.getRawValue() as any);
    this.members.activate(member.id); // Démo : activation automatique. À remplacer par validation back-office.
    this.router.navigate(['/carte']);
  }
}
