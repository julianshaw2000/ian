import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { SupabaseAuthService } from '../../shared/services/supabase-auth.service';

@Component({
  selector: 'app-admin-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './admin-login-page.component.html',
  styleUrls: ['./admin-login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLoginPageComponent {
  readonly form;

  submitting = false;
  errorMessage: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: SupabaseAuthService,
    private readonly router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async signInWithEmail(): Promise<void> {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = null;
    const { email, password } = this.form.getRawValue();

    const result = await this.auth.signInWithPassword(email, password);
    this.submitting = false;

    if (result.error) {
      this.errorMessage = result.error;
      return;
    }

    await this.router.navigate(['/admin/dashboard']);
  }
}


