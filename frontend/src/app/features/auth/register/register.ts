import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NbButton } from '@ng-brutalism/ui';
import { InputComponent } from '../../../shared/components/input/input.component';
import { PasswordInputComponent } from '../../../shared/components/password-input/password-input.component';
import { AuthService } from '../../../core/services/auth.service';
import { passwordMatchValidator, strongPasswordValidator } from '../../../core/validators/auth.validators';
import { NavbarComponent } from '../../../layouts/public-layout/navbar/navbar';
import { FooterComponent } from '../../../layouts/public-layout/footer/footer';
import { LucideAngularModule, Mail } from 'lucide-angular';

@Component({
  selector: 'app-register-page',
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
    LucideAngularModule,
  ],
  templateUrl: './register.html',
})
export class RegisterPage {
  readonly icons = { Mail };

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  protected readonly isLoading = signal(false);
  protected readonly isSuccess = signal(false);
  protected readonly generalError = signal<string | null>(null);

  // Strongly-typed reactive form controls
  protected readonly emailControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  protected readonly passwordControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, strongPasswordValidator],
  });

  protected readonly confirmPasswordControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  protected readonly registerForm = this.fb.group(
    {
      email: this.emailControl,
      password: this.passwordControl,
      confirmPassword: this.confirmPasswordControl,
    },
    {
      validators: [passwordMatchValidator],
    }
  );

  isFieldInvalid(fieldName: 'email' | 'password' | 'confirmPassword'): boolean {
    const control = this.getControl(fieldName);
    return control.invalid && (control.dirty || control.touched);
  }

  isFieldTouched(fieldName: 'email' | 'password' | 'confirmPassword'): boolean {
    const control = this.getControl(fieldName);
    return control.dirty || control.touched;
  }

  private getControl(fieldName: 'email' | 'password' | 'confirmPassword'): FormControl<string> {
    switch (fieldName) {
      case 'email':
        return this.emailControl;
      case 'password':
        return this.passwordControl;
      case 'confirmPassword':
        return this.confirmPasswordControl;
    }
  }

  getEmailErrorMessage(): string {
    if (!this.emailControl.dirty && !this.emailControl.touched) return '';
    if (this.emailControl.hasError('required')) {
      return 'El correo electrónico es obligatorio.';
    }
    if (this.emailControl.hasError('email')) {
      return 'Ingresa un formato de correo válido (ej: usuario@correo.com).';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    if (!this.passwordControl.dirty && !this.passwordControl.touched) return '';
    if (this.passwordControl.hasError('required')) {
      return 'La contraseña es obligatoria.';
    }
    if (this.passwordControl.hasError('strongPassword')) {
      return 'La contraseña no cumple con todos los requisitos de seguridad.';
    }
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    if (!this.confirmPasswordControl.dirty && !this.confirmPasswordControl.touched) return '';
    if (this.confirmPasswordControl.hasError('required')) {
      return 'La confirmación de contraseña es obligatoria.';
    }
    if (this.confirmPasswordControl.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden. Verifica que sean idénticas.';
    }
    return '';
  }

  async onSubmit(): Promise<void> {
    this.generalError.set(null);

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.emailControl.markAsTouched();
      this.passwordControl.markAsTouched();
      this.confirmPasswordControl.markAsTouched();

      if (this.confirmPasswordControl.hasError('passwordMismatch')) {
        this.generalError.set('Las contraseñas no coinciden.');
      } else {
        this.generalError.set('Por favor completa todos los campos requeridos con formato válido.');
      }
      return;
    }

    const email = this.emailControl.value;
    const password = this.passwordControl.value;

    this.isLoading.set(true);

    try {
      const result = await this.authService.register(email, password);

      if (result.success && result.user) {
        this.isSuccess.set(true);
      } else {
        this.generalError.set(result.error || 'No se pudo crear la cuenta. Intenta nuevamente.');
      }
    } catch {
      this.generalError.set('Ocurrió un error inesperado al conectar con el servidor.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
