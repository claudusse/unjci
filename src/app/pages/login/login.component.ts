import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, UserRole } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  passwordVisible = false;
  submitted = false;
  authenticationError = false;
  readonly registrationComplete: boolean;

  readonly form = new FormGroup({
    login: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    rememberMe: new FormControl(false, { nonNullable: true }),
    role: new FormControl<UserRole>('member', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    route: ActivatedRoute,
  ) {
    this.registrationComplete = route.snapshot.queryParamMap.get('inscription') === 'reussie';
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  submit(): void {
    this.submitted = true;
    this.authenticationError = false;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const role = this.form.controls.role.value;
    if (role === 'member') {
      const session = this.auth.loginMember(
        this.form.controls.login.value,
        this.form.controls.password.value,
      );
      if (!session) {
        this.authenticationError = true;
        return;
      }
    } else {
      this.auth.login(this.form.controls.login.value, role);
    }
    this.router.navigate([role === 'admin' ? '/administration' : '/espace-membre']);
  }
}
