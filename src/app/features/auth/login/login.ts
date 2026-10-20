import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NbButton } from '@ng-brutalism/ui';
import { InputComponent } from '../../../shared/components/input/input.component';
import { PasswordInputComponent } from '../../../shared/components/password-input/password-input.component';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from '../../../layouts/public-layout/navbar/navbar';
import { FooterComponent } from '../../../layouts/public-layout/footer/footer';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NbButton,
    InputComponent,
    PasswordInputComponent,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './login.html',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isLoading = signal(false);
  protected readonly generalError = signal<string | null>(null);

  protected readonly emailControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  protected readonly passwordControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6)],
  });

  protected readonly rememberMeControl = new FormControl(false, {
    nonNullable: true,
  });

  protected readonly loginForm = this.fb.group({
    email: this.emailControl,
    password: this.passwordControl,
    rememberMe: this.rememberMeControl,
  });

  isFieldInvalid(fieldName: 'email' | 'password'): boolean {
    const control = fieldName === 'email' ? this.emailControl : this.passwordControl;
    return control.invalid && (control.dirty || control.touched);
  }

  isFieldTouched(fieldName: 'email' | 'password'): boolean {
    const control = fieldName === 'email' ? this.emailControl : this.passwordControl;
    return control.dirty || control.touched;
  }

  getEmailErrorMessage(): string {
    if (this.emailControl.hasError('required')) {
      return 'El correo electrónico es obligatorio.';
    }
    if (this.emailControl.hasError('email')) {
      return 'Ingresa un formato de correo válido (ej: usuario@correo.com).';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    if (this.passwordControl.hasError('required')) {
      return 'La contraseña es obligatoria.';
    }
    if (this.passwordControl.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    return '';
  }

  fillDemoCredentials(role: 'admin' | 'client'): void {
    if (role === 'admin') {
      this.emailControl.setValue('admin@kokofee.com');
      this.passwordControl.setValue('kokofee2026');
      this.rememberMeControl.setValue(true);
    } else {
      this.emailControl.setValue('cliente@kokofee.com');
      this.passwordControl.setValue('barista2026');
      this.rememberMeControl.setValue(false);
    }
    this.generalError.set(null);
  }

  showForgotPasswordNotice(): void {
    this.generalError.set(
      'Para restablecer tu contraseña, ingresa tu correo y contacta al administrador de KOKOFEE o soporte@kokofee.com.'
    );
  }

  async onSubmit(): Promise<void> {
    this.generalError.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.generalError.set('Por favor completa todos los campos requeridos con formato válido.');
      return;
    }

    const email = this.emailControl.value;
    const password = this.passwordControl.value;
    this.isLoading.set(true);

    try {
      const result = await this.authService.login(email, password);

      if (result.success && result.user) {
        if (result.user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        this.generalError.set(result.error || 'Credenciales inválidas. Por favor intenta nuevamente.');
      }
    } catch {
      this.generalError.set('Ocurrió un error inesperado al conectar con el servidor.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
