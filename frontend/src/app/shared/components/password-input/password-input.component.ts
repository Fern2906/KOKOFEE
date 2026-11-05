import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NbInput, NbLabel, NbInputGroup, NbInputPrefix, NbInputSuffix } from '@ng-brutalism/ui';
import { LucideAngularModule, Lock, Eye, EyeOff, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NbInput, NbLabel, NbInputGroup, NbInputPrefix, NbInputSuffix, LucideAngularModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-1.5 w-full">
      @if (label()) {
        <label nbLabel [attr.for]="id()" class="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
          <span>{{ label() }}</span>
          @if (required()) {
            <span class="text-red-500 text-xs">*</span>
          }
        </label>
      }

      <nb-input-group class="w-full" [class.!border-red-500]="hasError()">
        @if (prefix()) {
          <span nbInputPrefix class="select-none font-mono font-bold text-sm">{{ prefix() }}</span>
        } @else if (prefixIcon()) {
          <span nbInputPrefix class="inline-flex items-center justify-center text-koko-espresso/70 select-none">
            <lucide-icon [img]="prefixIcon()!" [size]="16" [strokeWidth]="2.5" />
          </span>
        }

        <input
          nbInput
          [id]="id()"
          [type]="showPassword() ? 'text' : 'password'"
          [placeholder]="placeholder()"
          [autocomplete]="autocomplete()"
          [disabled]="disabled()"
          [value]="value()"
          (input)="handleInput($event)"
          (blur)="handleBlur()"
          [attr.aria-invalid]="hasError()"
          [attr.aria-describedby]="hasError() ? id() + '-error' : null"
        />

        <button
          type="button"
          nbInputSuffix
          (click)="togglePasswordVisibility()"
          [disabled]="disabled()"
          class="inline-flex items-center justify-center p-1 m-0 cursor-pointer text-koko-espresso/70 hover:text-koko-espresso transition-colors select-none focus:outline-none"
          [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Ver contraseña'"
          [attr.aria-pressed]="showPassword()"
        >
          <lucide-icon [img]="showPassword() ? icons.EyeOff : icons.Eye" [size]="16" [strokeWidth]="2.5" />
        </button>
      </nb-input-group>

      @if (hasError()) {
        <p [id]="id() + '-error'" class="text-xs font-bold text-red-500 flex items-center gap-1 mt-0.5 animate-in fade-in duration-150" role="alert">
          <span>⚠</span>
          <span>{{ errorMessage() }}</span>
        </p>
      }
    </div>
  `,
})
export class PasswordInputComponent implements ControlValueAccessor {
  readonly label = input<string>('Contraseña');
  readonly placeholder = input<string>('••••••••');
  readonly id = input<string>('password-input-' + Math.random().toString(36).substring(2, 9));
  readonly autocomplete = input<string>('current-password');
  readonly errorMessage = input<string>('');
  readonly required = input<boolean>(false);
  readonly isInvalid = input<boolean>(false);
  readonly isTouched = input<boolean>(false);
  readonly prefix = input<string>('');
  readonly prefixIcon = input<LucideIconData | null>(Lock);

  readonly icons = { Lock, Eye, EyeOff };

  protected readonly showPassword = signal(false);
  protected readonly value = signal<string>('');
  protected readonly disabled = signal<boolean>(false);

  readonly hasError = computed(
    () => (this.isInvalid() && this.isTouched()) || (!!this.errorMessage() && this.isTouched())
  );

  protected onChange: (val: string) => void = () => {};
  protected onTouched: () => void = () => {};

  togglePasswordVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }

  writeValue(val: unknown): void {
    this.value.set(val != null ? String(val) : '');
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  handleBlur(): void {
    this.onTouched();
  }
}
