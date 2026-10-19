import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates that the password meets specialty coffee security standards:
 * - At least 12 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one special symbol (!@#$%^&*...)
 */
export const strongPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value || '';
  if (!value) {
    return null; // Let Validators.required handle empty values
  }

  const hasMinLength = value.length >= 12;
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\/\\~`]/.test(value);

  const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasSpecialChar;

  if (isValid) {
    return null;
  }

  return {
    strongPassword: {
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasSpecialChar,
    },
  };
};

/**
 * Cross-field validator ensuring password and confirmPassword match
 */
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  // Do nothing if confirmPassword is empty and not dirty/touched yet
  if (!confirmPassword.value && !confirmPassword.dirty && !confirmPassword.touched) {
    return null;
  }

  if (password.value !== confirmPassword.value) {
    const currentErrors = confirmPassword.errors || {};
    confirmPassword.setErrors({ ...currentErrors, passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    if (confirmPassword.hasError('passwordMismatch')) {
      const { passwordMismatch, ...remainingErrors } = confirmPassword.errors || {};
      confirmPassword.setErrors(Object.keys(remainingErrors).length > 0 ? remainingErrors : null);
    }
    return null;
  }
};
